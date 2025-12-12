import { ProjectChatLog } from '@domain/base/project-chat-log/project-chat-log.domain';
import { newProjectChatLog } from '@domain/base/project-chat-log/project-chat-log.factory';
import { projectChatLogToResponse } from '@domain/base/project-chat-log/project-chat-log.mapper';
import { ProjectChatLogService } from '@domain/base/project-chat-log/project-chat-log.service';
import { ProjectChatSession } from '@domain/base/project-chat-session/project-chat-session.domain';
import { projectChatSessionFromPgWithState } from '@domain/base/project-chat-session/project-chat-session.mapper';
import { ProjectChatSessionService } from '@domain/base/project-chat-session/project-chat-session.service';
import { Project } from '@domain/base/project/project.domain';
import { projectFromPgWithState } from '@domain/base/project/project.mapper';
import { AiApiService } from '@domain/logic/ai-api/ai-api.service';
import { AiFileService } from '@domain/logic/ai-file/ai-file.service';
import { Injectable } from '@nestjs/common';
import { jsonObjectFrom } from 'kysely/helpers/postgres';

import { MainDb } from '@infra/db/db.main';
import { TransactionService } from '@infra/db/transaction/transaction.service';
import { LoggerService } from '@infra/global/logger/logger.service';
import { UserClaims } from '@infra/middleware/jwt/jwt.common';

import { LINE_AI_ERROR_REPLY } from '@app/worker/line-event/line-event.constant';

import { CommandInterface } from '@shared/common/common.type';
import { ApiException } from '@shared/http/http.exception';
import { toHttpSuccess } from '@shared/http/http.mapper';

import { ProjectChatDto, ProjectChatResponse } from './project-chat.dto';

type Entity = {
  projectChatSession: ProjectChatSession;
  project: Project;
  userChatLog: ProjectChatLog;
};

@Injectable()
export class ProjectChatCommand implements CommandInterface {
  constructor(
    private db: MainDb,
    private projectChatLogService: ProjectChatLogService,
    private projectChatSessionService: ProjectChatSessionService,
    private aiApiService: AiApiService,
    private loggerService: LoggerService,
    private transactionService: TransactionService,
    private aiFileService: AiFileService,
  ) {}

  async exec(
    claims: UserClaims,
    projectId: string,
    sessionId: string,
    body: ProjectChatDto,
  ): Promise<ProjectChatResponse> {
    const entity = await this.find(claims, projectId, sessionId, body);
    const botChatLog = await this.processAiChat(body.text, entity);

    entity.projectChatSession.edit({
      latestChatLogId: botChatLog.id,
    });

    await this.save(entity, botChatLog);

    return toHttpSuccess({
      data: {
        botChatLog: {
          attributes: projectChatLogToResponse(botChatLog),
        },
        replyText: botChatLog.message,
      },
    });
  }

  async save(entity: Entity, botChatLog: ProjectChatLog): Promise<void> {
    await this.transactionService.transaction(async () => {
      await this.projectChatLogService.saveBulk([
        entity.userChatLog,
        botChatLog,
      ]);
      await this.projectChatSessionService.save(entity.projectChatSession);

      await this.aiFileService.appendChatLogs({
        sessionId: entity.projectChatSession.id,
        lineChatLogs: [entity.userChatLog, botChatLog],
      });
    });
  }

  async find(
    claims: UserClaims,
    projectId: string,
    sessionId: string,
    body: ProjectChatDto,
  ): Promise<Entity> {
    const chatSession = await this.db.read
      .selectFrom('project_chat_sessions')
      .selectAll('project_chat_sessions')
      .select((eb) =>
        jsonObjectFrom(
          eb
            .selectFrom('projects')
            .selectAll('projects')
            .whereRef('projects.id', '=', 'project_chat_sessions.project_id'),
        ).as('project'),
      )
      .where('id', '=', sessionId)
      .where('project_chat_sessions.user_id', '=', claims.userId)
      .limit(1)
      .executeTakeFirst();

    if (
      !chatSession ||
      !chatSession.project ||
      chatSession.project.id !== projectId ||
      chatSession.latest_chat_log_id !== body.previousChatId
    ) {
      throw new ApiException(404, 'chatSessionNotFound');
    }

    const project = projectFromPgWithState(chatSession.project);

    const userChatLog = newProjectChatLog({
      chatSender: 'USER',
      message: body.text,
      parentId: body.previousChatId,
      projectChatSessionId: sessionId,
    });

    return {
      projectChatSession: projectChatSessionFromPgWithState(chatSession),
      project,
      userChatLog,
    };
  }

  async processAiChat(
    text: string,
    { project, projectChatSession, userChatLog }: Entity,
  ): Promise<ProjectChatLog> {
    const errorReplyChat = newProjectChatLog({
      chatSender: 'BOT',
      message: LINE_AI_ERROR_REPLY,
      parentId: userChatLog.id,
      projectChatSessionId: projectChatSession.id,
    });

    try {
      const res = await this.aiApiService.chat({
        text,
        project: project,
        sessionId: projectChatSession.id,
      });

      if (!res.isSuccess) {
        return errorReplyChat;
      }

      return newProjectChatLog({
        chatSender: 'BOT',
        message: res.data.text,
        parentId: userChatLog.id,
        projectChatSessionId: projectChatSession.id,
      });
    } catch (error) {
      this.loggerService.error(error);
      return errorReplyChat;
    }
  }
}

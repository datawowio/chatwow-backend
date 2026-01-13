import { AI_USAGE_REF_TABLE } from '@domain/base/ai-usage/ai-usage.constant';
import { AiUsage } from '@domain/base/ai-usage/ai-usage.domain';
import { newAiUsage } from '@domain/base/ai-usage/ai-usage.factory';
import { AppConfiguration } from '@domain/base/app-configuration/app-configuration.domain';
import { AppConfigurationService } from '@domain/base/app-configuration/app-configuration.service';
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
import { DomainEventQueue } from '@domain/queue/domain-event/domain-event.queue';
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
  aiConfig: AppConfiguration<'AI'>;
  projectChatSession: ProjectChatSession;
  project: Project;
  userChatLog: ProjectChatLog;
  botChatLog?: ProjectChatLog;
  aiUsage?: AiUsage;
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
    private appConfigurationService: AppConfigurationService,
    private domainEventQueue: DomainEventQueue,
  ) {}

  async exec(
    claims: UserClaims,
    sessionId: string,
    body: ProjectChatDto,
  ): Promise<ProjectChatResponse> {
    const entity = await this.find(claims, sessionId, body);
    const { botChatLog, aiUsage } = await this.processAiChat(body.text, entity);

    entity.botChatLog = botChatLog;
    entity.aiUsage = aiUsage;

    entity.projectChatSession.edit({
      latestChatLogId: botChatLog.id,
    });

    await this.save(entity);

    return toHttpSuccess({
      data: {
        botChatLog: {
          attributes: projectChatLogToResponse(botChatLog),
        },
        replyText: botChatLog.message,
      },
    });
  }

  async save(entity: Entity): Promise<void> {
    if (!entity.botChatLog) {
      throw new ApiException(500, 'unexpectNoBotChatLog');
    }
    if (!entity.aiUsage) {
      throw new ApiException(500, 'unexpectNoAiUsage');
    }

    const botChatLog = entity.botChatLog;
    const aiUsage = entity.aiUsage;

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

      this.domainEventQueue.jobProcessAiUsage({
        owner: 'project',
        aiUsage,
      });
    });
  }

  async find(
    claims: UserClaims,
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
      chatSession.latest_chat_log_id !== body.previousChatId
    ) {
      throw new ApiException(404, 'chatSessionNotFound');
    }

    const project = projectFromPgWithState(chatSession.project);
    const aiConfig = await this.appConfigurationService.findConfig('AI');

    const userChatLog = newProjectChatLog({
      chatSender: 'USER',
      message: body.text,
      parentId: body.previousChatId,
      projectChatSessionId: sessionId,
    });

    return {
      aiConfig,
      projectChatSession: projectChatSessionFromPgWithState(chatSession),
      project,
      userChatLog,
    };
  }

  async processAiChat(
    text: string,
    { project, projectChatSession, userChatLog, aiConfig }: Entity,
  ) {
    const botChatLog = newProjectChatLog({
      chatSender: 'BOT',
      message: LINE_AI_ERROR_REPLY,
      parentId: userChatLog.id,
      projectChatSessionId: projectChatSession.id,
    });

    const aiUsage = newAiUsage({
      actorId: projectChatSession.userId,
      data: {
        projectId: project.id,
        aiUsageAction: 'CHAT_PROJECT',
        refId: botChatLog.id,
        refTable: AI_USAGE_REF_TABLE.PROJECT_CHAT_LOG,
        aiModelName: aiConfig.configData.model,
      },
    }).record();

    try {
      const res = await this.aiApiService.chat({
        text,
        project: project,
        sessionId: projectChatSession.id,
        aiConfig,
      });

      if (res.isSuccess) {
        botChatLog.edit({
          message: res.data.text,
        });
        aiUsage.stopRecord({
          tokenUsed: res.data.tokenUsed,
          confidence: res.data.confidence,
        });
      }
    } catch (error) {
      this.loggerService.error(error);
      aiUsage.stopRecordError();
    }

    return { botChatLog, aiUsage };
  }
}

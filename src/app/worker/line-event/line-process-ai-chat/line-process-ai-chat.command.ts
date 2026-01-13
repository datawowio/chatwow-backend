import { AI_USAGE_REF_TABLE } from '@domain/base/ai-usage/ai-usage.constant';
import { AiUsage } from '@domain/base/ai-usage/ai-usage.domain';
import { newAiUsage } from '@domain/base/ai-usage/ai-usage.factory';
import { AppConfiguration } from '@domain/base/app-configuration/app-configuration.domain';
import { AppConfigurationService } from '@domain/base/app-configuration/app-configuration.service';
import { LineChatLog } from '@domain/base/line-chat-log/line-chat-log.domain';
import { newLineChatLog } from '@domain/base/line-chat-log/line-chat-log.factory';
import { LineSession } from '@domain/base/line-session/line-session.domain';
import { Project } from '@domain/base/project/project.domain';
import { projectFromPgWithState } from '@domain/base/project/project.mapper';
import { projectsTableFilter } from '@domain/base/project/project.util';
import { User } from '@domain/base/user/user.domain';
import { userFromPgWithState } from '@domain/base/user/user.mapper';
import { usersTableFilter } from '@domain/base/user/user.util';
import { AiApiService } from '@domain/logic/ai-api/ai-api.service';
import { DomainEventQueue } from '@domain/queue/domain-event/domain-event.queue';
import { LineEventQueue } from '@domain/queue/line-event/line-event.queue';
import { Injectable } from '@nestjs/common';

import { MainDb } from '@infra/db/db.main';
import { LineService } from '@infra/global/line/line.service';
import { LoggerService } from '@infra/global/logger/logger.service';

import { LINE_AI_ERROR_REPLY } from '../line-event.constant';
import { LineProcessAiChatJobData } from './line-process-ai-chat.type';

type Entity = {
  aiConfig: AppConfiguration<'AI'>;
  project: Project;
  user: User;
  lineSession: LineSession;
  lineChatLogs: LineChatLog[];
  aiUsage?: AiUsage;
};

@Injectable()
export class LineProcessAiChatCommand {
  constructor(
    private db: MainDb,
    private aiApiService: AiApiService,
    private lineEventQueue: LineEventQueue,
    private loggerService: LoggerService,
    private appConfigurationService: AppConfigurationService,
    private domainEventQueue: DomainEventQueue,
  ) {}

  async exec(body: LineProcessAiChatJobData) {
    const entity = await this.find(body);
    const lineService = new LineService(body.lineBot);

    let botMessage = '-';

    const botChatLog = newLineChatLog({
      chatSender: 'BOT',
      lineSessionId: entity.lineSession.id,
      message: botMessage,
      lineAccountId: entity.lineSession.lineAccountId,
    });
    const aiUsage = newAiUsage({
      actorId: entity.user.id,
      data: {
        projectId: entity.project.id,
        aiUsageAction: 'CHAT_LINE',
        refId: botChatLog.id,
        refTable: AI_USAGE_REF_TABLE.LINE_CHAT_LOG,
        aiModelName: entity.aiConfig.configData.model,
      },
    });

    const res = await this.aiApiService.chat({
      text: body.message,
      project: entity.project,
      sessionId: entity.lineSession.id,
      aiConfig: entity.aiConfig,
    });

    if (!res.isSuccess) {
      this.loggerService.error(`AI error: ${res.err.message}`);

      botMessage = LINE_AI_ERROR_REPLY;
      aiUsage.stopRecordError();
    } else {
      botMessage = res.data.text;
      aiUsage.stopRecord({
        tokenUsed: res.data.tokenUsed,
        confidence: res.data.confidence,
      });
    }

    botChatLog.edit({
      message: botMessage,
    });

    entity.lineChatLogs.push(botChatLog);
    entity.aiUsage = aiUsage;

    await lineService.reply(body.replyToken, botMessage);

    await this.save(entity);
  }

  async save(entity: Entity) {
    if (!entity.aiUsage) {
      throw new Error('unexpected no ai usage');
    }

    const aiUsage = entity.aiUsage;
    this.domainEventQueue.jobProcessAiUsage({
      owner: 'userGroup',
      aiUsage,
    });

    this.lineEventQueue.jobProcessChatLog(entity.lineChatLogs);
  }

  async find(body: LineProcessAiChatJobData): Promise<Entity> {
    const lineSession = body.lineSession;

    const rawProject = await this.db.read
      .selectFrom('projects')
      .selectAll('projects')
      .where(projectsTableFilter)
      .where('projects.id', '=', lineSession.projectId)
      .where('projects.project_status', '!=', 'INACTIVE')
      .executeTakeFirst();

    if (!rawProject) {
      throw new Error('project not found');
    }

    const rawUser = await this.db.read
      .selectFrom('users')
      .selectAll('users')
      .where(usersTableFilter)
      .where('users.line_account_id', '=', lineSession.lineAccountId)
      .where('users.user_status', '=', 'ACTIVE')
      .executeTakeFirst();

    if (!rawUser) {
      throw new Error('project not found');
    }

    const project = projectFromPgWithState(rawProject);
    const user = userFromPgWithState(rawUser);
    const aiConfig = await this.appConfigurationService.findConfig('AI');

    return {
      aiConfig,
      project,
      user,
      lineSession,
      lineChatLogs: body.lineChatLogs,
    };
  }
}

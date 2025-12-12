import { newLineChatLog } from '@domain/base/line-chat-log/line-chat-log.factory';
import { Project } from '@domain/base/project/project.domain';
import { projectFromPgWithState } from '@domain/base/project/project.mapper';
import { projectsTableFilter } from '@domain/base/project/project.util';
import { AiApiService } from '@domain/logic/ai-api/ai-api.service';
import { LineEventQueue } from '@domain/queue/line-event/line-event.queue';
import { Injectable } from '@nestjs/common';

import { MainDb } from '@infra/db/db.main';
import { LineService } from '@infra/global/line/line.service';
import { LoggerService } from '@infra/global/logger/logger.service';

import { LineProcessAiChatJobData } from './line-process-ai-chat.type';

@Injectable()
export class LineProcessAiChatCommand {
  constructor(
    private db: MainDb,
    private aiApiService: AiApiService,
    private lineEventQueue: LineEventQueue,
    private loggerService: LoggerService,
  ) {}

  async exec(body: LineProcessAiChatJobData) {
    const lineService = new LineService(body.lineBot);

    try {
      await this.process(lineService, body);
    } catch (err) {
      this.loggerService.error(err as Error);

      const message = 'ระบบขัดข้องโปรดลองใหม่อีกครั้ง';
      body.lineChatLogs.push(
        newLineChatLog({
          chatSender: 'BOT',
          lineSessionId: body.lineSession.id,
          message,
          lineAccountId: body.lineSession.lineAccountId,
        }),
      );

      await lineService.reply(body.replyToken, message);
    }

    this.lineEventQueue.jobProcessChatLog(body.lineChatLogs);
  }

  async process(lineService: LineService, body: LineProcessAiChatJobData) {
    const project = await this.find(body.lineSession.projectId);
    const res = await this.aiApiService.chat({
      text: body.message,
      project,
      lineSession: body.lineSession,
    });
    if (!res.isSuccess) {
      throw new Error(`AI error: ${res.err.message}`);
    }

    await lineService.reply(body.replyToken, res.data.text);
  }

  async find(projectId: string): Promise<Project> {
    const raw = await this.db.read
      .selectFrom('projects')
      .selectAll('projects')
      .where(projectsTableFilter)
      .where('projects.id', '=', projectId)
      .executeTakeFirst();

    if (!raw) {
      throw new Error('project not found');
    }

    return projectFromPgWithState(raw);
  }
}

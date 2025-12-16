import { newLineChatLog } from '@domain/base/line-chat-log/line-chat-log.factory';
import { LineSessionService } from '@domain/base/line-session/line-session.service';
import { projectFromPgWithState } from '@domain/base/project/project.mapper';
import { ProjectService } from '@domain/base/project/project.service';
import { LineEventQueue } from '@domain/queue/line-event/line-event.queue';
import { Injectable } from '@nestjs/common';

import { MainDb } from '@infra/db/db.main';
import { LineService } from '@infra/global/line/line.service';

import { LINE_PROMPT_PROJECT_SELECTION_REPLY } from '../line-event.constant';
import { LineShowSelectionMenuJobData } from './line-show-selection-menu.type';

@Injectable()
export class LineShowSelectionMenuCommand {
  constructor(
    private db: MainDb,

    private lineSessionService: LineSessionService,
    private projectService: ProjectService,
    private lineEventQueue: LineEventQueue,
  ) {}

  async exec({
    lineBot,
    lineAccountId,
    replyToken,
    addMessages,
    lineChatLogs,
  }: LineShowSelectionMenuJobData) {
    const lineService = new LineService(lineBot);
    const projects = await this.getUserProjects(lineAccountId);

    // inactive all session
    await this.lineSessionService.inactiveAll(lineAccountId, lineBot.id);

    await lineService.replyProjectSelection(replyToken, projects, addMessages);

    lineChatLogs.push(
      newLineChatLog({
        chatSender: 'BOT',
        lineAccountId,
        message: LINE_PROMPT_PROJECT_SELECTION_REPLY,
      }),
    );
    this.lineEventQueue.jobProcessChatLog(lineChatLogs);
  }

  async getUserProjects(lineAccountId: string) {
    const ids = await this.projectService.getIds({
      options: {
        filter: {
          lineAccountId,
          projectStatus: 'ACTIVE',
        },
      },
    });
    if (!ids.length) {
      return [];
    }

    const projects = await this.db.read
      .selectFrom('projects')
      .selectAll()
      .where('id', 'in', ids)
      .execute();

    return projects.map((p) => projectFromPgWithState(p));
  }
}

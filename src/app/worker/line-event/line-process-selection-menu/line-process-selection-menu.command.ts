import { LineSession } from '@domain/base/line-session/line-session.domain';
import { newLineSession } from '@domain/base/line-session/line-session.factory';
import { lineSessionFromPgWithState } from '@domain/base/line-session/line-session.mapper';
import { LineSessionService } from '@domain/base/line-session/line-session.service';
import { projectFromPgWithState } from '@domain/base/project/project.mapper';
import { ProjectService } from '@domain/base/project/project.service';
import { Injectable } from '@nestjs/common';

import { MainDb } from '@infra/db/db.main';
import { LineService } from '@infra/global/line/line.service';

import {
  LINE_INVALID_PROJECT_SELECTION_REPLY,
  LINE_SUCCESS_PROJECT_SELECTION_REPLY,
} from '../line-event.constant';
import {
  GetSessionOpts,
  LineProcessSelectionMenuJobData,
} from './line-process-selection-menu.type';

@Injectable()
export class LineProcessSelectionMenuCommand {
  constructor(
    private db: MainDb,

    private lineSessionService: LineSessionService,
    private projectService: ProjectService,
  ) {}

  async exec({
    lineBot,
    lineAccountId,
    message,
    replyToken,
  }: LineProcessSelectionMenuJobData) {
    const lineService = new LineService(lineBot);
    const projects = await this.getUserProjects(lineAccountId);

    const selectedProject = projects.find((p) => p.projectName === message);
    if (!selectedProject) {
      await lineService.reply(replyToken, LINE_INVALID_PROJECT_SELECTION_REPLY);
      return;
    }

    const lineSession = await this.getSession({
      projectId: selectedProject.id,
      lineBotId: lineBot.id,
      lineAccountId,
    });
    lineSession.edit({
      lineSessionStatus: 'ACTIVE',
    });

    await this.save(lineSession);

    await lineService.reply(
      replyToken,
      LINE_SUCCESS_PROJECT_SELECTION_REPLY(selectedProject.projectName),
    );
  }

  async save(lineSession: LineSession) {
    await this.lineSessionService.save(lineSession);
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

  async getSession({ projectId, lineBotId, lineAccountId }: GetSessionOpts) {
    const rawSession = await this.db.read
      .selectFrom('line_sessions')
      .selectAll()
      .where('line_account_id', '=', lineAccountId)
      .where('line_bot_id', '=', lineBotId)
      .where('project_id', '=', projectId)
      .limit(1)
      .executeTakeFirst();

    if (rawSession) {
      return lineSessionFromPgWithState(rawSession);
    }

    return newLineSession({
      lineAccountId,
      lineBotId,
      projectId,
      lineSessionStatus: 'ACTIVE',
    });
  }
}

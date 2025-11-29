import { LineSessionService } from '@domain/base/line-session/line-session.service';
import { projectFromPgWithState } from '@domain/base/project/project.mapper';
import { ProjectService } from '@domain/base/project/project.service';
import { Injectable } from '@nestjs/common';

import { MainDb } from '@infra/db/db.main';
import { LineService } from '@infra/global/line/line.service';

import { LineShowSelectionMenuJobData } from './line-show-selection-menu.type';

@Injectable()
export class LineShowSelectionMenuCommand {
  constructor(
    private db: MainDb,

    private lineSessionService: LineSessionService,
    private projectService: ProjectService,
  ) {}

  async exec({
    lineBot,
    lineAccountId,
    replyToken,
    addMessages,
  }: LineShowSelectionMenuJobData) {
    const lineService = new LineService(lineBot);
    const projects = await this.getUserProjects(lineAccountId);

    // inactive all session
    await this.lineSessionService.inactiveAll(lineAccountId, lineBot.id);

    await lineService.replyProjectSelection(replyToken, projects, addMessages);
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

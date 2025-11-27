import { LineSessionService } from '@domain/base/line-session/line-session.service';
import { ProjectMapper } from '@domain/base/project/project.mapper';
import { ProjectService } from '@domain/base/project/project.service';
import { Inject, Injectable } from '@nestjs/common';

import { READ_DB, ReadDB } from '@infra/db/db.common';
import { LineService } from '@infra/global/line/line.service';

import { LineShowSelectionMenuJobData } from './line-show-selection-menu.type';

@Injectable()
export class LineShowSelectionMenuCommand {
  constructor(
    @Inject(READ_DB)
    private readDb: ReadDB,

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

    const projects = await this.readDb
      .selectFrom('projects')
      .selectAll()
      .where('id', 'in', ids)
      .execute();

    return projects.map((p) => ProjectMapper.fromPgWithState(p));
  }
}

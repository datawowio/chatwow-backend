import { LineSession } from '@domain/base/line-session/line-session.domain';
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

  async exec({ lineBot, lineSession, data }: LineShowSelectionMenuJobData) {
    const lineService = new LineService(lineBot);
    lineSession.edit({
      lineSessionStatus: 'PROJECT_SELECTION',
    });

    const projects = await this.getUserProjects(data.lineAccountId);

    await this.save(lineSession);
    await lineService.replyProjectSelection(
      data.replyToken,
      projects,
      data.addMessages,
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

    const projects = await this.readDb
      .selectFrom('projects')
      .selectAll()
      .where('id', 'in', ids)
      .execute();

    return projects.map((p) => ProjectMapper.fromPgWithState(p));
  }
}

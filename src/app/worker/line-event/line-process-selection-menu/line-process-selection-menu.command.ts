import { LineSession } from '@domain/base/line-session/line-session.domain';
import { LineSessionService } from '@domain/base/line-session/line-session.service';
import { ProjectMapper } from '@domain/base/project/project.mapper';
import { ProjectService } from '@domain/base/project/project.service';
import { Inject, Injectable } from '@nestjs/common';

import { READ_DB, ReadDB } from '@infra/db/db.common';
import { LineService } from '@infra/global/line/line.service';

import {
  LINE_INVALID_PROJECT_SELECTION_REPLY,
  LINE_SUCCESS_PROJECT_SELECTION_REPLY,
} from '../line-event.constant';
import { LineProcessSelectionMenuJobData } from './line-process-selection-menu.type';

@Injectable()
export class LineProcessSelectionMenuCommand {
  constructor(
    @Inject(READ_DB)
    private readDb: ReadDB,

    private lineSessionService: LineSessionService,
    private projectService: ProjectService,
  ) {}

  async exec({ lineBot, lineSession, data }: LineProcessSelectionMenuJobData) {
    const lineService = new LineService(lineBot);
    const projects = await this.getUserProjects(data.lineAccountId);

    const selectedProject = projects.find(
      (p) => p.projectName === data.message,
    );
    if (!selectedProject) {
      await lineService.reply(
        data.replyToken,
        LINE_INVALID_PROJECT_SELECTION_REPLY,
      );
      return;
    }

    lineSession.edit({
      projectId: selectedProject.id,
      lineSessionStatus: 'ACTIVE',
    });
    await this.save(lineSession);

    await lineService.reply(
      data.replyToken,
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

    const projects = await this.readDb
      .selectFrom('projects')
      .selectAll()
      .where('id', 'in', ids)
      .execute();

    return projects.map((p) => ProjectMapper.fromPgWithState(p));
  }
}

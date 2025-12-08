import { Project } from '@domain/base/project/project.domain';
import { projectToResponse } from '@domain/base/project/project.mapper';
import { ProjectService } from '@domain/base/project/project.service';
import { AiEventQueue } from '@domain/queue/ai-event/ai-event.queue';
import { Injectable } from '@nestjs/common';

import { UserClaims } from '@infra/middleware/jwt/jwt.common';

import { CommandInterface } from '@shared/common/common.type';
import { ApiException } from '@shared/http/http.exception';
import { toHttpSuccess } from '@shared/http/http.mapper';

import { RegenerateProjectSummaryResponse } from './regenerate-project-summary.dto';

@Injectable()
export class RegenerateProjectSummaryCommand implements CommandInterface {
  constructor(
    private projectService: ProjectService,
    private aiEventQueue: AiEventQueue,
  ) {}

  async exec(
    claims: UserClaims,
    id: string,
  ): Promise<RegenerateProjectSummaryResponse> {
    const project = await this.find(claims, id);
    project.edit({
      data: {
        projectStatus: 'PROCESSING',
      },
    });

    await this.save(project);

    return toHttpSuccess({
      data: {
        project: {
          attributes: projectToResponse(project),
        },
      },
    });
  }

  async find(claims: UserClaims, id: string): Promise<Project> {
    const project = await this.projectService.findOne(id, claims);

    if (!project) {
      throw new ApiException(400, 'projectNotFound');
    }

    return project;
  }

  async save(project: Project) {
    await this.projectService.save(project);
    this.aiEventQueue.jobProjectMdGenerate(project);
  }
}

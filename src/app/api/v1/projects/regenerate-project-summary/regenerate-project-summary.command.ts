import { Project } from '@domain/base/project/project.domain';
import { projectToResponse } from '@domain/base/project/project.mapper';
import { ProjectService } from '@domain/base/project/project.service';
import { AiEventQueue } from '@domain/queue/ai-event/ai-event.queue';
import { Injectable } from '@nestjs/common';

import { UserClaims } from '@infra/middleware/jwt/jwt.common';

import { ApiException } from '@shared/http/http.exception';
import { toHttpSuccess } from '@shared/http/http.mapper';

import { RegenerateProjectSummaryResponse } from './regenerate-project-summary.dto';

@Injectable()
export class RegenerateProjectSummaryCommand {
  constructor(
    private projectService: ProjectService,
    private aiEventQueue: AiEventQueue,
  ) {}

  async exec(
    claims: UserClaims,
    id: string,
  ): Promise<RegenerateProjectSummaryResponse> {
    const project = await this.find(claims, id);
    this.aiEventQueue.jobProjectMdGenerate(project);

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
}

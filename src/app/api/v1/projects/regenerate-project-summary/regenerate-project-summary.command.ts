import { AppConfigurationService } from '@domain/base/app-configuration/app-configuration.service';
import { Project } from '@domain/base/project/project.domain';
import { projectToResponse } from '@domain/base/project/project.mapper';
import { ProjectService } from '@domain/base/project/project.service';
import { QueueDispatchService } from '@domain/logic/queue-dispatch/queue-dispatch.service';
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
    private appConfigurationService: AppConfigurationService,
    private queueDispatchService: QueueDispatchService,
  ) {}

  async exec(
    claims: UserClaims,
    id: string,
  ): Promise<RegenerateProjectSummaryResponse> {
    const { project, aiConfig } = await this.find(claims, id);
    project.edit({
      actorId: claims.userId,
      data: {
        projectStatus: 'PROCESSING',
      },
    });

    await this.save(project);

    this.queueDispatchService.projectMdGenerate(project, aiConfig);

    return toHttpSuccess({
      data: {
        project: {
          attributes: projectToResponse(project),
        },
      },
    });
  }

  async find(claims: UserClaims, id: string) {
    const project = await this.projectService.findOne(id, claims);
    if (!project) {
      throw new ApiException(400, 'projectNotFound');
    }

    const aiConfig = await this.appConfigurationService.findConfig('AI');

    return { project, aiConfig };
  }

  async save(project: Project) {
    await this.projectService.save(project);
  }
}

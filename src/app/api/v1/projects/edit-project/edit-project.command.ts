import { Project } from '@domain/base/project/project.domain';
import { projectToResponse } from '@domain/base/project/project.mapper';
import { ProjectService } from '@domain/base/project/project.service';
import { Injectable } from '@nestjs/common';

import { TransactionService } from '@infra/db/transaction/transaction.service';
import { UserClaims } from '@infra/middleware/jwt/jwt.common';

import { CommandInterface } from '@shared/common/common.type';
import { ApiException } from '@shared/http/http.exception';
import { toHttpSuccess } from '@shared/http/http.mapper';

import { EditProjectDto, EditProjectResponse } from './edit-project.dto';

@Injectable()
export class EditProjectCommand implements CommandInterface {
  constructor(
    private projectService: ProjectService,
    private transactionService: TransactionService,
  ) {}

  async exec(
    claims: UserClaims,
    id: string,
    body: EditProjectDto,
  ): Promise<EditProjectResponse> {
    const project = await this.find(claims, id);

    if (body.project) {
      project.edit({
        data: body.project,
        actorId: claims.userId,
      });
    }

    await this.save(project);

    return toHttpSuccess({
      data: {
        project: {
          attributes: projectToResponse(project),
        },
      },
    });
  }

  async save(project: Project): Promise<void> {
    await this.transactionService.transaction(async () => {
      await this.projectService.save(project);
    });
  }

  async find(claims: UserClaims, id: string) {
    const project = await this.projectService.findOne(id, claims);

    if (!project) {
      throw new ApiException(400, 'projectNotFound');
    }

    return project;
  }
}

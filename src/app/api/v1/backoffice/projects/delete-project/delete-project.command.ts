import { Project } from '@domain/base/project/project.domain';
import { projectToResponse } from '@domain/base/project/project.mapper';
import { ProjectService } from '@domain/base/project/project.service';
import { AiFileService } from '@domain/logic/ai-file/ai-file.service';
import { Injectable } from '@nestjs/common';

import { TransactionService } from '@infra/db/transaction/transaction.service';
import { UserClaims } from '@infra/middleware/jwt/jwt.common';

import { CommandInterface } from '@shared/common/common.type';
import { ApiException } from '@shared/http/http.exception';
import { toHttpSuccess } from '@shared/http/http.mapper';

import { DeleteProjectResponse } from './delete-project.dto';

@Injectable()
export class DeleteProjectCommand implements CommandInterface {
  constructor(
    private projectService: ProjectService,

    private transactionService: TransactionService,
    private aiFileService: AiFileService,
  ) {}

  async exec(claims: UserClaims, id: string): Promise<DeleteProjectResponse> {
    const project = await this.find(claims, id);

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
    await this.aiFileService.deleteProjectAiFile(project);

    await this.transactionService.transaction(async () => {
      await this.projectService.delete(project.id);
    });
  }

  async find(claims: UserClaims, id: string): Promise<Project> {
    const project = await this.projectService.findOne(id, { manager: claims });

    if (!project) {
      throw new ApiException(400, 'projectNotFound');
    }

    return project;
  }
}

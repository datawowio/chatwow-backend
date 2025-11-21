import { Project } from '@domain/base/project/project.domain';
import { ProjectMapper } from '@domain/base/project/project.mapper';
import { ProjectService } from '@domain/base/project/project.service';
import { Injectable } from '@nestjs/common';

import { TransactionService } from '@infra/global/transaction/transaction.service';

import { CommandInterface } from '@shared/common/common.type';
import { ApiException } from '@shared/http/http.exception';

import { EditProjectDto, EditProjectResponse } from './edit-project.dto';

@Injectable()
export class EditProjectCommand implements CommandInterface {
  constructor(
    private projectService: ProjectService,
    private transactionService: TransactionService,
  ) {}

  async exec(id: string, body: EditProjectDto): Promise<EditProjectResponse> {
    const project = await this.find(id);

    if (body.project) {
      project.edit(body.project);
    }

    await this.save(project);

    return {
      success: true,
      key: '',
      data: {
        project: {
          attributes: ProjectMapper.toResponse(project),
        },
      },
    };
  }

  async save(project: Project): Promise<void> {
    await this.transactionService.transaction(async () => {
      await this.projectService.save(project);
    });
  }

  async find(id: string) {
    const project = await this.projectService.findOne(id);

    if (!project) {
      throw new ApiException(400, 'projectNotFound');
    }

    return project;
  }
}

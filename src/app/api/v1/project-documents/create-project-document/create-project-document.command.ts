import { ProjectDocument } from '@domain/base/project-document/project-document.domain';
import { ProjectDocumentMapper } from '@domain/base/project-document/project-document.mapper';
import { ProjectDocumentService } from '@domain/base/project-document/project-document.service';
import { ProjectMapper } from '@domain/base/project/project.mapper';
import { ProjectService } from '@domain/base/project/project.service';
import { STORED_FILE_OWNER_TABLE } from '@domain/base/stored-file/stored-file.constant';
import { StoredFile } from '@domain/base/stored-file/stored-file.domain';
import { StoredFileMapper } from '@domain/base/stored-file/stored-file.mapper';
import { StoredFileService } from '@domain/base/stored-file/stored-file.service';
import { Injectable } from '@nestjs/common';

import { TransactionService } from '@infra/global/transaction/transaction.service';

import { CommandInterface } from '@shared/common/common.type';
import { ApiException } from '@shared/http/http.exception';

import {
  CreateProjectDocumentDto,
  CreateProjectDocumentResponse,
} from './create-project-document.dto';

type Entity = {
  projectDocument: ProjectDocument;
  storedFile: StoredFile;
};

@Injectable()
export class CreateProjectDocumentCommand implements CommandInterface {
  constructor(
    private projectDocumentService: ProjectDocumentService,
    private projectService: ProjectService,
    private storedFileService: StoredFileService,
    private transactionService: TransactionService,
  ) {}

  async exec(
    body: CreateProjectDocumentDto,
  ): Promise<CreateProjectDocumentResponse> {
    const projectDocument = ProjectDocument.new(body.projectDocument);
    const project = await this.getProject(body.projectDocument.projectId);

    const storedFile = StoredFile.new({
      ...body.storedFile,
      ownerId: projectDocument.id,
      ownerTable: STORED_FILE_OWNER_TABLE.PROJECT_DOCUMENT,
    });

    await this.save({
      projectDocument,
      storedFile,
    });

    return {
      success: true,
      key: '',
      data: {
        projectDocument: {
          attributes: ProjectDocumentMapper.toResponse(projectDocument),
          relations: {
            project: {
              attributes: ProjectMapper.toResponse(project),
            },
            storedFile: {
              attributes: StoredFileMapper.toResponse(storedFile),
            },
          },
        },
      },
    };
  }

  async save(entity: Entity): Promise<void> {
    await this.transactionService.transaction(async () => {
      await this.projectDocumentService.save(entity.projectDocument);
      await this.storedFileService.save(entity.storedFile);
    });
  }

  async getProject(projectId: string) {
    const project = await this.projectService.findOne(projectId);
    if (!project) {
      throw new ApiException(404, 'projectNotFound');
    }

    return project;
  }
}

import { ProjectDocument } from '@domain/base/project-document/project-document.domain';
import { newProjectDocument } from '@domain/base/project-document/project-document.factory';
import { projectDocumentToResponse } from '@domain/base/project-document/project-document.mapper';
import { ProjectDocumentService } from '@domain/base/project-document/project-document.service';
import { Project } from '@domain/base/project/project.domain';
import { projectToResponse } from '@domain/base/project/project.mapper';
import { ProjectService } from '@domain/base/project/project.service';
import { STORED_FILE_OWNER_TABLE } from '@domain/base/stored-file/stored-file.constant';
import { StoredFile } from '@domain/base/stored-file/stored-file.domain';
import { newStoredFile } from '@domain/base/stored-file/stored-file.factory';
import { storedFileToResponse } from '@domain/base/stored-file/stored-file.mapper';
import { StoredFileService } from '@domain/base/stored-file/stored-file.service';
import { AiFileService } from '@domain/logic/ai-file/ai-file.service';
import { setProjectRequireRegenerate } from '@domain/logic/project-action/project-action.util';
import { QueueDispatchService } from '@domain/logic/queue-dispatch/queue-dispatch.service';
import { Injectable } from '@nestjs/common';

import { TransactionService } from '@infra/db/transaction/transaction.service';
import { UserClaims } from '@infra/middleware/jwt/jwt.common';

import { CommandInterface } from '@shared/common/common.type';
import { ApiException } from '@shared/http/http.exception';
import { toHttpSuccess } from '@shared/http/http.mapper';

import {
  CreateProjectDocumentDto,
  CreateProjectDocumentResponse,
} from './create-project-document.dto';

type Entity = {
  projectDocument: ProjectDocument;
  storedFile: StoredFile;
  project: Project;
};

@Injectable()
export class CreateProjectDocumentCommand implements CommandInterface {
  constructor(
    private projectDocumentService: ProjectDocumentService,
    private projectService: ProjectService,
    private storedFileService: StoredFileService,
    private transactionService: TransactionService,
    private aiFileService: AiFileService,
    private queueDispatchService: QueueDispatchService,
  ) {}

  async exec(
    claims: UserClaims,
    body: CreateProjectDocumentDto,
  ): Promise<CreateProjectDocumentResponse> {
    const projectDocument = newProjectDocument({
      actorId: claims.userId,
      data: body.projectDocument,
    });
    const project = await this.getProject(
      claims,
      body.projectDocument.projectId,
    );
    setProjectRequireRegenerate({
      project,
      projectDocuments: [projectDocument],
    });

    const storedFile = newStoredFile({
      ...body.storedFile,
      ownerId: projectDocument.id,
      ownerTable: STORED_FILE_OWNER_TABLE.PROJECT_DOCUMENT,
    });

    await this.save({
      projectDocument,
      storedFile,
      project,
    });

    return toHttpSuccess({
      data: {
        projectDocument: {
          attributes: projectDocumentToResponse(projectDocument),
          relations: {
            project: {
              attributes: projectToResponse(project),
            },
            storedFile: {
              attributes: storedFileToResponse(storedFile),
            },
          },
        },
      },
    });
  }

  async save(entity: Entity): Promise<void> {
    await this.transactionService.transaction(async () => {
      await this.storedFileService.save(entity.storedFile);
      await this.aiFileService.writeProjectDocumentRawFile(
        entity.projectDocument,
        entity.storedFile,
      );

      await this.projectDocumentService.save(entity.projectDocument);
      await this.projectService.save(entity.project);
    });

    await this.queueDispatchService.projectDocumentMdGenerate(
      entity.projectDocument,
    );
  }

  async getProject(claims: UserClaims, projectId: string) {
    const project = await this.projectService.findOne(projectId, claims);
    if (!project) {
      throw new ApiException(404, 'projectNotFound');
    }

    return project;
  }
}

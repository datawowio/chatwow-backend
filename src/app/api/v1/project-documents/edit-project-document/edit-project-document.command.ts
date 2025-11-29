import { ProjectDocument } from '@domain/base/project-document/project-document.domain';
import {
  projectDocumentFromPgWithState,
  projectDocumentToResponse,
} from '@domain/base/project-document/project-document.mapper';
import { ProjectDocumentService } from '@domain/base/project-document/project-document.service';
import {
  addProjectDocumentActorFilter,
  projectDocumentsTableFilter,
} from '@domain/base/project-document/project-document.util';
import { Project } from '@domain/base/project/project.domain';
import {
  projectFromPgWithState,
  projectToResponse,
} from '@domain/base/project/project.mapper';
import { projectsTableFilter } from '@domain/base/project/project.util';
import { STORED_FILE_OWNER_TABLE } from '@domain/base/stored-file/stored-file.constant';
import { StoredFile } from '@domain/base/stored-file/stored-file.domain';
import { newStoredFile } from '@domain/base/stored-file/stored-file.factory';
import { storedFileToResponse } from '@domain/base/stored-file/stored-file.mapper';
import { StoredFileService } from '@domain/base/stored-file/stored-file.service';
import { Injectable } from '@nestjs/common';
import { jsonObjectFrom } from 'kysely/helpers/postgres';

import { MainDb } from '@infra/db/db.main';
import { TransactionService } from '@infra/db/transaction/transaction.service';
import { UserClaims } from '@infra/middleware/jwt/jwt.common';

import { CommandInterface } from '@shared/common/common.type';
import { ApiException } from '@shared/http/http.exception';
import { toHttpSuccess } from '@shared/http/http.mapper';

import {
  EditProjectDocumentDto,
  EditProjectDocumentResponse,
} from './edit-project-document.dto';

type Entity = {
  projectDocument: ProjectDocument;
  storedFile?: StoredFile;
  project: Project;
};

@Injectable()
export class EditProjectDocumentCommand implements CommandInterface {
  constructor(
    private db: MainDb,

    private projectDocumentService: ProjectDocumentService,
    private storedFileService: StoredFileService,
    private transactionService: TransactionService,
  ) {}

  async exec(
    claims: UserClaims,
    id: string,
    body: EditProjectDocumentDto,
  ): Promise<EditProjectDocumentResponse> {
    const entity = await this.find(claims, id);

    if (body.projectDocument) {
      entity.projectDocument.edit({
        actorId: claims.userId,
        data: body.projectDocument,
      });
    }
    this.editStoredFile(entity, body);

    await this.save(entity);

    return toHttpSuccess({
      data: {
        projectDocument: {
          attributes: projectDocumentToResponse(entity.projectDocument),
          relations: {
            project: {
              attributes: projectToResponse(entity.project),
            },
            storedFile: entity.storedFile
              ? {
                  attributes: storedFileToResponse(entity.storedFile),
                }
              : undefined,
          },
        },
      },
    });
  }

  async find(actor: UserClaims, id: string): Promise<Entity> {
    const projectDocument = await this.db.read
      .selectFrom('project_documents')
      .selectAll()
      .select((q) => [
        jsonObjectFrom(
          q
            .selectFrom('projects')
            .selectAll()
            .where(projectsTableFilter)
            .whereRef('projects.id', '=', 'project_documents.project_id'),
        )
          .$notNull()
          .as('project'),
      ])
      .where('id', '=', id)
      .where(projectDocumentsTableFilter)
      .$call((q) => addProjectDocumentActorFilter(q, actor))
      .executeTakeFirst();

    if (!projectDocument) {
      throw new ApiException(404, 'projectDocumentNotFound');
    }

    return {
      projectDocument: projectDocumentFromPgWithState(projectDocument),
      project: projectFromPgWithState(projectDocument.project),
    };
  }

  async save(entity: Entity): Promise<void> {
    await this.transactionService.transaction(async () => {
      await this.projectDocumentService.save(entity.projectDocument);

      if (entity.storedFile) {
        await this.storedFileService.save(entity.storedFile);
      }
    });
  }

  editStoredFile(entity: Entity, body: EditProjectDocumentDto) {
    if (!body.storedFile) {
      return;
    }

    entity.storedFile = newStoredFile({
      ...body.storedFile,
      ownerId: entity.projectDocument.id,
      ownerTable: STORED_FILE_OWNER_TABLE.PROJECT_DOCUMENT,
    });
  }
}

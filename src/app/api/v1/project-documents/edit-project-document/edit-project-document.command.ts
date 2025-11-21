import { ProjectDocument } from '@domain/base/project-document/project-document.domain';
import { ProjectDocumentMapper } from '@domain/base/project-document/project-document.mapper';
import { ProjectDocumentService } from '@domain/base/project-document/project-document.service';
import { projectDocumentsTableFilter } from '@domain/base/project-document/project-document.util';
import { Project } from '@domain/base/project/project.domain';
import { ProjectMapper } from '@domain/base/project/project.mapper';
import { projectsTableFilter } from '@domain/base/project/project.util';
import { STORED_FILE_OWNER_TABLE } from '@domain/base/stored-file/stored-file.constant';
import { StoredFile } from '@domain/base/stored-file/stored-file.domain';
import { StoredFileMapper } from '@domain/base/stored-file/stored-file.mapper';
import { StoredFileService } from '@domain/base/stored-file/stored-file.service';
import { Inject, Injectable } from '@nestjs/common';
import { jsonObjectFrom } from 'kysely/helpers/postgres';

import { READ_DB, ReadDB } from '@infra/db/db.common';
import { TransactionService } from '@infra/global/transaction/transaction.service';

import { CommandInterface } from '@shared/common/common.type';
import { ApiException } from '@shared/http/http.exception';

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
    @Inject(READ_DB)
    private readDb: ReadDB,

    private projectDocumentService: ProjectDocumentService,
    private storedFileService: StoredFileService,
    private transactionService: TransactionService,
  ) {}

  async exec(
    id: string,
    body: EditProjectDocumentDto,
  ): Promise<EditProjectDocumentResponse> {
    const entity = await this.find(id);

    if (body.projectDocument) {
      entity.projectDocument.edit(body.projectDocument);
    }
    this.editStoredFile(entity, body);

    await this.save(entity);

    return {
      success: true,
      key: '',
      data: {
        projectDocument: {
          attributes: ProjectDocumentMapper.toResponse(entity.projectDocument),
          relations: {
            project: {
              attributes: ProjectMapper.toResponse(entity.project),
            },
            storedFile: entity.storedFile
              ? {
                  attributes: StoredFileMapper.toResponse(entity.storedFile),
                }
              : undefined,
          },
        },
      },
    };
  }

  async find(id: string): Promise<Entity> {
    const projectDocument = await this.readDb
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
      .executeTakeFirst();

    if (!projectDocument) {
      throw new ApiException(404, 'projectDocumentNotFound');
    }

    return {
      projectDocument: ProjectDocumentMapper.fromPgWithState(projectDocument),
      project: ProjectMapper.fromPgWithState(projectDocument.project),
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

    entity.storedFile = StoredFile.new({
      ...body.storedFile,
      ownerId: entity.projectDocument.id,
      ownerTable: STORED_FILE_OWNER_TABLE.PROJECT_DOCUMENT,
    });
  }
}

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
import { ProjectService } from '@domain/base/project/project.service';
import { projectsTableFilter } from '@domain/base/project/project.util';
import { AiFileService } from '@domain/logic/ai-file/ai-file.service';
import { Injectable } from '@nestjs/common';
import { jsonObjectFrom } from 'kysely/helpers/postgres';

import { MainDb } from '@infra/db/db.main';
import { TransactionService } from '@infra/db/transaction/transaction.service';
import { UserClaims } from '@infra/middleware/jwt/jwt.common';

import { CommandInterface } from '@shared/common/common.type';
import { ApiException } from '@shared/http/http.exception';
import { toHttpSuccess } from '@shared/http/http.mapper';

import { DeleteProjectDocumentResponse } from './delete-project-document.dto';

type Entity = {
  projectDocument: ProjectDocument;
  project: Project;
};

@Injectable()
export class DeleteProjectDocumentCommand implements CommandInterface {
  constructor(
    private db: MainDb,

    private projectDocumentService: ProjectDocumentService,
    private projectService: ProjectService,
    private transactionService: TransactionService,
    private aiFileService: AiFileService,
  ) {}

  async exec(
    claims: UserClaims,
    id: string,
  ): Promise<DeleteProjectDocumentResponse> {
    const entity = await this.find(claims, id);

    entity.project.edit({
      data: {
        isRequireRegenerate: true,
      },
    });

    await this.save(entity);

    return toHttpSuccess({
      data: {
        projectDocument: {
          attributes: projectDocumentToResponse(entity.projectDocument),
          relations: {
            project: {
              attributes: projectToResponse(entity.project),
            },
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
    await this.aiFileService.deleteProjectDocumentAiFile(
      entity.projectDocument,
    );

    await this.transactionService.transaction(async () => {
      await this.projectDocumentService.delete(entity.projectDocument.id);
      await this.projectService.save(entity.project);
    });
  }
}

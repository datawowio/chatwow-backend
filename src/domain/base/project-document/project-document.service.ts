import { Injectable } from '@nestjs/common';

import { MainDb } from '@infra/db/db.main';
import { addPagination, queryCount, sortQb } from '@infra/db/db.util';
import { UserClaims } from '@infra/middleware/jwt/jwt.common';

import { diff, getUniqueIds } from '@shared/common/common.func';
import { isDefined } from '@shared/common/common.validator';

import { ProjectDocument } from './project-document.domain';
import {
  projectDocumentFromPgWithState,
  projectDocumentToPg,
} from './project-document.mapper';
import {
  addProjectDocumentActorFilter,
  projectDocumentsTableFilter,
} from './project-document.util';
import {
  ProjectDocumentFilterOptions,
  ProjectDocumentQueryOptions,
} from './project-document.zod';

@Injectable()
export class ProjectDocumentService {
  constructor(private db: MainDb) {}

  async getIds(opts?: ProjectDocumentQueryOptions) {
    const { sort, pagination, filter } = opts?.options || {};

    const qb = await this._getFilterQb({
      filter,
      actor: opts?.actor,
    })
      .select('project_documents.id')
      .$if(!!sort?.length, (q) =>
        sortQb(q, sort, {
          id: 'project_documents.id',
          createdAt: 'project_documents.created_at',
          documentStatus: 'project_documents.document_status',
        }),
      )
      .$call((q) => addPagination(q, pagination))
      .execute();

    return getUniqueIds(qb);
  }

  async getCount(opts?: ProjectDocumentFilterOptions) {
    const totalCount = await this
      //
      ._getFilterQb(opts)
      .$call((q) => queryCount(q));

    return totalCount;
  }

  async findOne(
    id: string,
    actor?: UserClaims,
  ): Promise<ProjectDocument | null> {
    const projectDocumentPg = await this.db.read
      .selectFrom('project_documents')
      .selectAll('project_documents')
      .$if(isDefined(actor), (qb) => addProjectDocumentActorFilter(qb, actor!))
      .where('id', '=', id)
      .limit(1)
      .executeTakeFirst();

    if (!projectDocumentPg) {
      return null;
    }

    const projectDocument = projectDocumentFromPgWithState(projectDocumentPg);
    return projectDocument;
  }

  async save(projectDocument: ProjectDocument) {
    this._validate(projectDocument);

    if (!projectDocument.isPersist) {
      await this._create(projectDocument);
    } else {
      await this._update(projectDocument.id, projectDocument);
    }

    projectDocument.setPgState(projectDocumentToPg);
  }

  async saveBulk(projectDocuments: ProjectDocument[]) {
    return Promise.all(projectDocuments.map((p) => this.save(p)));
  }

  async delete(id: string) {
    await this.db.write
      //
      .deleteFrom('project_documents')
      .where('id', '=', id)
      .execute();
  }

  async deleteBulk(ids: string[]) {
    await Promise.all(ids.map((id) => this.delete(id)));
  }

  private async _create(projectDocument: ProjectDocument): Promise<void> {
    await this.db.write
      //
      .insertInto('project_documents')
      .values(projectDocumentToPg(projectDocument))
      .execute();
  }

  private async _update(
    id: string,
    projectDocument: ProjectDocument,
  ): Promise<void> {
    const data = diff(
      projectDocument.pgState,
      projectDocumentToPg(projectDocument),
    );
    if (!data) {
      return;
    }

    await this.db.write
      //
      .updateTable('project_documents')
      .set(data)
      .where('id', '=', id)
      .execute();
  }

  private _getFilterQb(opts?: ProjectDocumentFilterOptions) {
    const { filter, actor } = opts || {};

    return this.db.read
      .selectFrom('project_documents')
      .where(projectDocumentsTableFilter)
      .$if(isDefined(filter?.documentStatus), (qb) =>
        qb.where('document_status', '=', filter!.documentStatus!),
      )
      .$if(isDefined(actor), (qb) => addProjectDocumentActorFilter(qb, actor!))
      .$if(isDefined(filter?.projectName), (qb) =>
        qb
          .innerJoin('projects', 'projects.id', 'project_documents.project_id')
          .where('projects.project_name', '=', filter!.projectName!),
      )
      .$if(!!filter?.projectIds?.length, (qb) =>
        qb
          .innerJoin('projects', 'projects.id', 'project_documents.project_id')
          .where('projects.id', 'in', filter!.projectIds!),
      )
      .$if(isDefined(filter?.search), (qb) => {
        const search = `%${filter!.search!}%`;

        return qb.where((eb) =>
          eb.or([eb('project_documents.document_details', 'ilike', search)]),
        );
      });
  }

  private _validate(_projectDocument: ProjectDocument) {
    // validation rules can be added here
  }
}

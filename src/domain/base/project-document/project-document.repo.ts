import { Injectable } from '@nestjs/common';
import { Except } from 'type-fest';

import { addPagination, queryCount, sortQb } from '@infra/db/db.util';

import { diff, getUniqueIds } from '@shared/common/common.func';
import { BaseRepo } from '@shared/common/common.repo';
import { isDefined } from '@shared/common/common.validator';

import { ProjectDocument } from './project-document.domain';
import { ProjectDocumentMapper } from './project-document.mapper';
import { projectDocumentsTableFilter } from './project-document.util';
import { ProjectDocumentQueryOptions } from './project-document.zod';

@Injectable()
export class ProjectDocumentRepo extends BaseRepo {
  async getIds(opts?: ProjectDocumentQueryOptions) {
    opts ??= {};
    const { sort, pagination } = opts;

    const qb = await this._getFilterQb(opts)
      .select('project_documents.id')
      .$if(!!sort?.length, (q) =>
        sortQb(q, opts!.sort, {
          id: 'project_documents.id',
          createdAt: 'project_documents.created_at',
          documentStatus: 'project_documents.document_status',
        }),
      )
      .$call((q) => addPagination(q, pagination))
      .execute();

    return getUniqueIds(qb);
  }

  async getCount(opts?: ProjectDocumentQueryOptions) {
    const totalCount = await this
      //
      ._getFilterQb(opts)
      .$call((q) => queryCount(q));

    return totalCount;
  }

  async create(projectDocument: ProjectDocument): Promise<void> {
    await this.db
      //
      .insertInto('project_documents')
      .values(ProjectDocumentMapper.toPg(projectDocument))
      .execute();
  }

  async update(id: string, projectDocument: ProjectDocument): Promise<void> {
    const data = diff(
      projectDocument.pgState,
      ProjectDocumentMapper.toPg(projectDocument),
    );
    if (!data) {
      return;
    }

    await this.db
      //
      .updateTable('project_documents')
      .set(data)
      .where('id', '=', id)
      .execute();
  }

  async findOne(id: string): Promise<ProjectDocument | null> {
    const projectDocumentPg = await this.readDb
      .selectFrom('project_documents')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();

    if (!projectDocumentPg) {
      return null;
    }

    const projectDocument =
      ProjectDocumentMapper.fromPgWithState(projectDocumentPg);
    return projectDocument;
  }

  async delete(id: string): Promise<void> {
    await this.db
      //
      .deleteFrom('project_documents')
      .where('id', '=', id)
      .execute();
  }

  private _getFilterQb(
    opts?: Except<ProjectDocumentQueryOptions, 'pagination'>,
  ) {
    const filter = opts?.filter;

    return this.readDb
      .selectFrom('project_documents')
      .where(projectDocumentsTableFilter)
      .$if(isDefined(filter?.documentStatus), (qb) =>
        qb.where('document_status', '=', filter!.documentStatus!),
      )
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
}

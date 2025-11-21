import { ProjectDocumentMapper } from '@domain/base/project-document/project-document.mapper';
import { ProjectDocumentService } from '@domain/base/project-document/project-document.service';
import { ProjectMapper } from '@domain/base/project/project.mapper';
import { StoredFileMapper } from '@domain/base/stored-file/stored-file.mapper';
import { Inject, Injectable } from '@nestjs/common';

import { READ_DB, ReadDB } from '@infra/db/db.common';
import { filterQbIds } from '@infra/db/db.util';

import { getPagination } from '@shared/common/common.pagintaion';
import { QueryInterface } from '@shared/common/common.type';

import { projectDocumentsV1InclusionQb } from '../project-documents.v1.util';
import {
  ListProjectDocumentsDto,
  ListProjectDocumentsResponse,
} from './list-project-documents.dto';

@Injectable()
export class ListProjectDocumentsQuery implements QueryInterface {
  constructor(
    @Inject(READ_DB)
    private readDb: ReadDB,
    private projectsDocumentService: ProjectDocumentService,
  ) {}

  async exec(
    query: ListProjectDocumentsDto,
  ): Promise<ListProjectDocumentsResponse> {
    const { result, totalCount } = await this.getRaw(query);

    return {
      success: true,
      key: '',
      meta: {
        pagination: getPagination(result, totalCount, query.pagination),
      },
      data: {
        projectDocuments: result.map((projectDocument) => ({
          attributes: ProjectDocumentMapper.pgToResponse(projectDocument),
          relations: {
            storedFile: projectDocument.storedFile
              ? {
                  attributes: StoredFileMapper.pgToResponse(
                    projectDocument.storedFile,
                  ),
                }
              : undefined,
            project: projectDocument.project
              ? {
                  attributes: ProjectMapper.pgToResponse(
                    projectDocument.project,
                  ),
                }
              : undefined,
          },
        })),
      },
    };
  }

  async getRaw(query: ListProjectDocumentsDto) {
    const ids = await this.projectsDocumentService.getIds({
      filter: query.filter,
      sort: query.sort,
      pagination: query.pagination,
    });
    if (!ids) {
      return {
        result: [],
        totalCount: 0,
      };
    }

    const result = await this.readDb
      .selectFrom('project_documents')
      .$call((q) => projectDocumentsV1InclusionQb(q, query.includes))
      .selectAll()
      .$call((q) => filterQbIds(ids, q, 'project_documents.id'))
      .execute();

    const totalCount = await this.projectsDocumentService.getCount({
      filter: query.countFilter,
    });

    return {
      result,
      totalCount,
    };
  }
}

import { projectDocumentPgToResponse } from '@domain/base/project-document/project-document.mapper';
import { ProjectDocumentService } from '@domain/base/project-document/project-document.service';
import { projectPgToResponse } from '@domain/base/project/project.mapper';
import { storedFilePgToResponse } from '@domain/base/stored-file/stored-file.mapper';
import { userPgToResponse } from '@domain/base/user/user.mapper';
import { Injectable } from '@nestjs/common';

import { MainDb } from '@infra/db/db.main';
import { filterQbIds } from '@infra/db/db.util';
import { UserClaims } from '@infra/middleware/jwt/jwt.common';

import { getPagination } from '@shared/common/common.pagination';
import { QueryInterface } from '@shared/common/common.type';
import { toHttpSuccess } from '@shared/http/http.mapper';

import { projectDocumentsV1InclusionQb } from '../project-documents.v1.util';
import {
  ListProjectDocumentsDto,
  ListProjectDocumentsResponse,
} from './list-project-documents.dto';

@Injectable()
export class ListProjectDocumentsQuery implements QueryInterface {
  constructor(
    private db: MainDb,
    private projectsDocumentService: ProjectDocumentService,
  ) {}

  async exec(
    claims: UserClaims,
    query: ListProjectDocumentsDto,
  ): Promise<ListProjectDocumentsResponse> {
    const { result, totalCount } = await this.getRaw(claims, query);

    return toHttpSuccess({
      meta: {
        pagination: getPagination(result, totalCount, query.pagination),
      },
      data: {
        projectDocuments: result.map((projectDocument) => ({
          attributes: projectDocumentPgToResponse(projectDocument),
          relations: {
            storedFile: projectDocument.storedFile
              ? {
                  attributes: storedFilePgToResponse(
                    projectDocument.storedFile,
                  ),
                }
              : undefined,
            project: projectDocument.project
              ? {
                  attributes: projectPgToResponse(projectDocument.project),
                }
              : undefined,
            createdBy: projectDocument.createdBy
              ? {
                  attributes: userPgToResponse(projectDocument.createdBy),
                }
              : undefined,
            updatedBy: projectDocument.updatedBy
              ? {
                  attributes: userPgToResponse(projectDocument.updatedBy),
                }
              : undefined,
          },
        })),
      },
    });
  }

  async getRaw(actor: UserClaims, query: ListProjectDocumentsDto) {
    const ids = await this.projectsDocumentService.getIds({
      actor,
      options: {
        filter: query.filter,
        sort: query.sort,
        pagination: query.pagination,
      },
    });
    if (!ids) {
      return {
        result: [],
        totalCount: 0,
      };
    }

    const result = await this.db.read
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

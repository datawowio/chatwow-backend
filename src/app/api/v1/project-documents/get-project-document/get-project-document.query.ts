import { projectDocumentPgToResponse } from '@domain/base/project-document/project-document.mapper';
import {
  addProjectDocumentActorFilter,
  projectDocumentsTableFilter,
} from '@domain/base/project-document/project-document.util';
import { projectPgToResponse } from '@domain/base/project/project.mapper';
import { storedFilePgToResponse } from '@domain/base/stored-file/stored-file.mapper';
import { userPgToResponse } from '@domain/base/user/user.mapper';
import { Injectable } from '@nestjs/common';

import { MainDb } from '@infra/db/db.main';
import { UserClaims } from '@infra/middleware/jwt/jwt.common';

import { QueryInterface } from '@shared/common/common.type';
import { ApiException } from '@shared/http/http.exception';
import { toHttpSuccess } from '@shared/http/http.mapper';

import { projectDocumentsV1InclusionQb } from '../project-documents.v1.util';
import {
  GetProjectDocumentDto,
  GetProjectDocumentResponse,
} from './get-project-document.dto';

@Injectable()
export class GetProjectDocumentQuery implements QueryInterface {
  constructor(private db: MainDb) {}

  async exec(
    claims: UserClaims,
    id: string,
    query: GetProjectDocumentDto,
  ): Promise<GetProjectDocumentResponse> {
    const projectDocument = await this.getRaw(claims, id, query);

    return toHttpSuccess({
      data: {
        projectDocument: {
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
        },
      },
    });
  }

  async getRaw(actor: UserClaims, id: string, query: GetProjectDocumentDto) {
    const result = await this.db.read
      .selectFrom('project_documents')
      .$call((q) => projectDocumentsV1InclusionQb(q, query.includes))
      .selectAll('project_documents')
      .where(projectDocumentsTableFilter)
      .where('project_documents.id', '=', id)
      .$call((q) => addProjectDocumentActorFilter(q, actor))
      .limit(1)
      .executeTakeFirst();

    if (!result) {
      throw new ApiException(404, 'projectDocumentNotFound');
    }

    return result;
  }
}

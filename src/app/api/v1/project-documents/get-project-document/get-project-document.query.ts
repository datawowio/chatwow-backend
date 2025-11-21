import { ProjectDocumentMapper } from '@domain/base/project-document/project-document.mapper';
import { projectDocumentsTableFilter } from '@domain/base/project-document/project-document.util';
import { ProjectMapper } from '@domain/base/project/project.mapper';
import { StoredFileMapper } from '@domain/base/stored-file/stored-file.mapper';
import { UserMapper } from '@domain/base/user/user.mapper';
import { Inject, Injectable } from '@nestjs/common';

import { READ_DB, ReadDB } from '@infra/db/db.common';

import { QueryInterface } from '@shared/common/common.type';
import { ApiException } from '@shared/http/http.exception';

import { projectDocumentsV1InclusionQb } from '../project-documents.v1.util';
import {
  GetProjectDocumentDto,
  GetProjectDocumentResponse,
} from './get-project-document.dto';

@Injectable()
export class GetProjectDocumentQuery implements QueryInterface {
  constructor(
    @Inject(READ_DB)
    private readDb: ReadDB,
  ) {}

  async exec(
    id: string,
    query: GetProjectDocumentDto,
  ): Promise<GetProjectDocumentResponse> {
    const projectDocument = await this.getRaw(id, query);

    return {
      success: true,
      key: '',
      data: {
        projectDocument: {
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
            createdBy: projectDocument.createdBy
              ? {
                  attributes: UserMapper.pgToResponse(
                    projectDocument.createdBy,
                  ),
                }
              : undefined,
            updatedBy: projectDocument.updatedBy
              ? {
                  attributes: UserMapper.pgToResponse(
                    projectDocument.updatedBy,
                  ),
                }
              : undefined,
          },
        },
      },
    };
  }

  async getRaw(id: string, query: GetProjectDocumentDto) {
    const result = await this.readDb
      .selectFrom('project_documents')
      .$call((q) => projectDocumentsV1InclusionQb(q, query.includes))
      .selectAll('project_documents')
      .where(projectDocumentsTableFilter)
      .where('project_documents.id', '=', id)
      .executeTakeFirst();

    if (!result) {
      throw new ApiException(404, 'projectDocumentNotFound');
    }

    return result;
  }
}

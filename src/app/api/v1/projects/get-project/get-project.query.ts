import { ProjectDocumentMapper } from '@domain/base/project-document/project-document.mapper';
import { ProjectMapper } from '@domain/base/project/project.mapper';
import { projectsTableFilter } from '@domain/base/project/project.util';
import { StoredFileMapper } from '@domain/base/stored-file/stored-file.mapper';
import { UserGroupMapper } from '@domain/base/user-group/user-group.mapper';
import { UserMapper } from '@domain/base/user/user.mapper';
import { Inject, Injectable } from '@nestjs/common';

import { READ_DB, ReadDB } from '@infra/db/db.common';

import { QueryInterface } from '@shared/common/common.type';
import { ApiException } from '@shared/http/http.exception';

import { projectsV1InclusionQb } from '../projects.v1.util';
import { GetProjectDto, GetProjectResponse } from './get-project.dto';

@Injectable()
export class GetProjectQuery implements QueryInterface {
  constructor(
    @Inject(READ_DB)
    private readDb: ReadDB,
  ) {}

  async exec(id: string, query: GetProjectDto): Promise<GetProjectResponse> {
    const project = await this.getRaw(id, query);

    return {
      success: true,
      key: '',
      data: {
        project: {
          attributes: ProjectMapper.pgToResponse(project),
          relations: {
            manageUsers:
              project.manageUsers &&
              project.manageUsers.map((user) => ({
                attributes: UserMapper.pgToResponse(user),
              })),
            projectDocuments:
              project.projectDocuments &&
              project.projectDocuments.map((doc) => ({
                attributes: ProjectDocumentMapper.pgToResponse(doc),
                relations: {
                  createdBy: doc.createdBy
                    ? {
                        attributes: UserMapper.pgToResponse(doc.createdBy),
                      }
                    : undefined,
                  updatedBy: doc.updatedBy
                    ? {
                        attributes: UserMapper.pgToResponse(doc.updatedBy),
                      }
                    : undefined,
                  storedFile: doc.storedFile
                    ? {
                        attributes: StoredFileMapper.pgToResponse(
                          doc.storedFile,
                        ),
                      }
                    : undefined,
                },
              })),
            userGroups:
              project.userGroups &&
              project.userGroups.map((group) => ({
                attributes: UserGroupMapper.pgToResponse(group),
              })),
            createdBy: project.createdBy
              ? {
                  attributes: UserMapper.pgToResponse(project.createdBy),
                }
              : undefined,
            updatedBy: project.updatedBy
              ? {
                  attributes: UserMapper.pgToResponse(project.updatedBy),
                }
              : undefined,
          },
        },
      },
    };
  }

  async getRaw(id: string, query: GetProjectDto) {
    const result = await this.readDb
      .selectFrom('projects')
      .$call((q) => projectsV1InclusionQb(q, query.includes))
      .selectAll('projects')
      .where(projectsTableFilter)
      .where('projects.id', '=', id)
      .executeTakeFirst();

    if (!result) {
      throw new ApiException(404, 'projectNotFound');
    }

    return result;
  }
}

import { projectDocumentPgToResponse } from '@domain/base/project-document/project-document.mapper';
import { projectPgToResponse } from '@domain/base/project/project.mapper';
import { ProjectService } from '@domain/base/project/project.service';
import { storedFilePgToResponse } from '@domain/base/stored-file/stored-file.mapper';
import { userGroupPgToResponse } from '@domain/base/user-group/user-group.mapper';
import { userPgToResponse } from '@domain/base/user/user.mapper';
import { Injectable } from '@nestjs/common';

import { MainDb } from '@infra/db/db.main';
import { filterQbIds } from '@infra/db/db.util';
import { UserClaims } from '@infra/middleware/jwt/jwt.common';

import { getPagination } from '@shared/common/common.pagintaion';
import { QueryInterface } from '@shared/common/common.type';

import { projectsV1InclusionQb } from '../projects.v1.util';
import { ListProjectsDto, ListProjectsResponse } from './list-projects.dto';

@Injectable()
export class ListProjectsQuery implements QueryInterface {
  constructor(
    private db: MainDb,
    private projectsService: ProjectService,
  ) {}

  async exec(
    claims: UserClaims,
    query: ListProjectsDto,
  ): Promise<ListProjectsResponse> {
    const { result, totalCount } = await this.getRaw(claims, query);

    return {
      success: true,
      key: '',
      meta: {
        pagination: getPagination(result, totalCount, query.pagination),
      },
      data: {
        projects: result.map((project) => ({
          attributes: projectPgToResponse(project),
          relations: {
            manageUsers:
              project.manageUsers &&
              project.manageUsers.map((user) => ({
                attributes: userPgToResponse(user),
              })),
            projectDocuments:
              project.projectDocuments &&
              project.projectDocuments.map((doc) => ({
                attributes: projectDocumentPgToResponse(doc),
                relations: {
                  createdBy: doc.createdBy
                    ? {
                        attributes: userPgToResponse(doc.createdBy),
                      }
                    : undefined,
                  updatedBy: doc.updatedBy
                    ? {
                        attributes: userPgToResponse(doc.updatedBy),
                      }
                    : undefined,
                  storedFile: doc.storedFile
                    ? {
                        attributes: storedFilePgToResponse(doc.storedFile),
                      }
                    : undefined,
                },
              })),
            userGroups:
              project.userGroups &&
              project.userGroups.map((group) => ({
                attributes: userGroupPgToResponse(group),
              })),
            createdBy: project.createdBy
              ? {
                  attributes: userPgToResponse(project.createdBy),
                }
              : undefined,
            updatedBy: project.updatedBy
              ? {
                  attributes: userPgToResponse(project.updatedBy),
                }
              : undefined,
          },
        })),
      },
    };
  }

  async getRaw(actor: UserClaims, query: ListProjectsDto) {
    const ids = await this.projectsService.getIds({
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
      .selectFrom('projects')
      .$call((q) => projectsV1InclusionQb(q, query.includes, actor))
      .selectAll()
      .$call((q) => filterQbIds(ids, q, 'projects.id'))
      .execute();

    const totalCount = await this.projectsService.getCount({
      filter: query.countFilter,
      actor,
    });

    return {
      result,
      totalCount,
    };
  }
}

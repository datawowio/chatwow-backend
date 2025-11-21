import { ProjectDocumentMapper } from '@domain/base/project-document/project-document.mapper';
import { ProjectMapper } from '@domain/base/project/project.mapper';
import { ProjectService } from '@domain/base/project/project.service';
import { StoredFileMapper } from '@domain/base/stored-file/stored-file.mapper';
import { UserGroupMapper } from '@domain/base/user-group/user-group.mapper';
import { UserMapper } from '@domain/base/user/user.mapper';
import { Inject, Injectable } from '@nestjs/common';

import { READ_DB, ReadDB } from '@infra/db/db.common';
import { filterQbIds } from '@infra/db/db.util';

import { getPagination } from '@shared/common/common.pagintaion';
import { QueryInterface } from '@shared/common/common.type';

import { projectsV1InclusionQb } from '../projects.v1.util';
import { ListProjectsDto, ListProjectsResponse } from './list-projects.dto';

@Injectable()
export class ListProjectsQuery implements QueryInterface {
  constructor(
    @Inject(READ_DB)
    private readDb: ReadDB,
    private projectsService: ProjectService,
  ) {}

  async exec(query: ListProjectsDto): Promise<ListProjectsResponse> {
    const { result, totalCount } = await this.getRaw(query);

    return {
      success: true,
      key: '',
      meta: {
        pagination: getPagination(result, totalCount, query.pagination),
      },
      data: {
        projects: result.map((project) => ({
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
          },
        })),
      },
    };
  }

  async getRaw(query: ListProjectsDto) {
    const ids = await this.projectsService.getIds({
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
      .selectFrom('projects')
      .$call((q) => projectsV1InclusionQb(q, query.includes))
      .selectAll()
      .$call((q) => filterQbIds(ids, q, 'projects.id'))
      .execute();

    const totalCount = await this.projectsService.getCount({
      filter: query.countFilter,
    });

    return {
      result,
      totalCount,
    };
  }
}

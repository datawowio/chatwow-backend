import { LineAccountMapper } from '@domain/base/line-account/line-account.mapper';
import { ProjectMapper } from '@domain/base/project/project.mapper';
import { UserGroupMapper } from '@domain/base/user-group/user-group.mapper';
import { UserMapper } from '@domain/base/user/user.mapper';
import { UserService } from '@domain/base/user/user.service';
import { Inject } from '@nestjs/common';

import { READ_DB, ReadDB } from '@infra/db/db.common';
import { filterQbIds } from '@infra/db/db.util';

import { getPagination } from '@shared/common/common.pagintaion';
import { QueryInterface } from '@shared/common/common.type';

import { usersV1InclusionQb } from '../users.v1.util';
import { ListUsersDto, ListUsersResponse } from './list-users.dto';

export class ListUsersQuery implements QueryInterface {
  constructor(
    @Inject(READ_DB)
    private readDb: ReadDB,

    private userService: UserService,
  ) {}

  async exec(query: ListUsersDto): Promise<ListUsersResponse> {
    const { result, totalCount } = await this.getRaw(query);

    return {
      success: true,
      key: '',
      meta: {
        pagination: getPagination(result, totalCount, query.pagination),
      },
      data: {
        users: result.map((user) => ({
          attributes: UserMapper.pgToResponse(user),
          relations: {
            lineAccount: user.lineAccount
              ? {
                  attributes: LineAccountMapper.pgToResponse(user.lineAccount),
                }
              : undefined,
            manageProjects: user.manageProjects
              ? user.manageProjects.map((project) => ({
                  attributes: ProjectMapper.pgToResponse(project),
                }))
              : undefined,
            userGroups: user.userGroups
              ? user.userGroups.map((group) => ({
                  attributes: UserGroupMapper.pgToResponse(group),
                }))
              : undefined,
            createdBy: user.createdBy
              ? {
                  attributes: UserMapper.pgToResponse(user.createdBy),
                }
              : undefined,
            updatedBy: user.updatedBy
              ? {
                  attributes: UserMapper.pgToResponse(user.updatedBy),
                }
              : undefined,
          },
        })),
      },
    };
  }

  async getRaw(query: ListUsersDto) {
    const ids = await this.userService.getIds({
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
      .selectFrom('users')
      .$call((q) => usersV1InclusionQb(q, query.includes))
      .selectAll()
      .$call((q) => filterQbIds(ids, q, 'users.id'))
      .execute();

    const totalCount = await this.userService.getCount({
      filter: query.countFilter,
    });

    return {
      result,
      totalCount,
    };
  }
}

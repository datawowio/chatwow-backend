import { lineAccountPgToResponse } from '@domain/base/line-account/line-account.mapper';
import { projectPgToResponse } from '@domain/base/project/project.mapper';
import { userGroupPgToResponse } from '@domain/base/user-group/user-group.mapper';
import { userPgToResponse } from '@domain/base/user/user.mapper';
import { UserService } from '@domain/base/user/user.service';

import { MainDb } from '@infra/db/db.main';
import { filterQbIds } from '@infra/db/db.util';

import { getPagination } from '@shared/common/common.pagintaion';
import { QueryInterface } from '@shared/common/common.type';

import { usersV1InclusionQb } from '../users.v1.util';
import { ListUsersDto, ListUsersResponse } from './list-users.dto';

export class ListUsersQuery implements QueryInterface {
  constructor(
    private db: MainDb,

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
          attributes: userPgToResponse(user),
          relations: {
            lineAccount: user.lineAccount
              ? {
                  attributes: lineAccountPgToResponse(user.lineAccount),
                }
              : undefined,
            manageProjects: user.manageProjects
              ? user.manageProjects.map((project) => ({
                  attributes: projectPgToResponse(project),
                }))
              : undefined,
            userGroups: user.userGroups
              ? user.userGroups.map((group) => ({
                  attributes: userGroupPgToResponse(group),
                }))
              : undefined,
            createdBy: user.createdBy
              ? {
                  attributes: userPgToResponse(user.createdBy),
                }
              : undefined,
            updatedBy: user.updatedBy
              ? {
                  attributes: userPgToResponse(user.updatedBy),
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

    const result = await this.db.read
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

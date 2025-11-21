import { ProjectMapper } from '@domain/base/project/project.mapper';
import { UserGroupMapper } from '@domain/base/user-group/user-group.mapper';
import { UserGroupService } from '@domain/base/user-group/user-group.service';
import { UserMapper } from '@domain/base/user/user.mapper';
import { Inject, Injectable } from '@nestjs/common';

import { READ_DB, ReadDB } from '@infra/db/db.common';
import { filterQbIds } from '@infra/db/db.util';

import { getPagination } from '@shared/common/common.pagintaion';
import { QueryInterface } from '@shared/common/common.type';

import { userGroupsV1InclusionQb } from '../user-groups.v1.util';
import {
  ListUserGroupsDto,
  ListUserGroupsResponse,
} from './list-user-groups.dto';

@Injectable()
export class ListUserGroupsQuery implements QueryInterface {
  constructor(
    @Inject(READ_DB)
    private readDb: ReadDB,

    private userGroupsService: UserGroupService,
  ) {}

  async exec(query: ListUserGroupsDto): Promise<ListUserGroupsResponse> {
    const { result, totalCount } = await this.getRaw(query);

    return {
      success: true,
      key: '',
      meta: {
        pagination: getPagination(result, totalCount, query.pagination),
      },
      data: {
        userGroups: result.map((userGroup) => ({
          attributes: UserGroupMapper.pgToResponse(userGroup),
          relations: {
            projects:
              userGroup.projects &&
              userGroup.projects.map((project) => ({
                attributes: ProjectMapper.pgToResponse(project),
              })),
            users:
              userGroup.users &&
              userGroup.users.map((user) => ({
                attributes: UserMapper.pgToResponse(user),
              })),
          },
        })),
      },
    };
  }

  async getRaw(query: ListUserGroupsDto) {
    const ids = await this.userGroupsService.getIds({
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
      .selectFrom('user_groups')
      .$call((q) => userGroupsV1InclusionQb(q, query.includes))
      .selectAll()
      .$call((q) => filterQbIds(ids, q, 'user_groups.id'))
      .execute();

    const totalCount = await this.userGroupsService.getCount({
      filter: query.countFilter,
    });

    return {
      result,
      totalCount,
    };
  }
}

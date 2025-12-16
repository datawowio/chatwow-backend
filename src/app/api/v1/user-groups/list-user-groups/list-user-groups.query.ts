import { projectPgToResponse } from '@domain/base/project/project.mapper';
import { userGroupPgToResponse } from '@domain/base/user-group/user-group.mapper';
import { UserGroupService } from '@domain/base/user-group/user-group.service';
import { userPgToResponse } from '@domain/base/user/user.mapper';
import { Injectable } from '@nestjs/common';

import { MainDb } from '@infra/db/db.main';
import { filterQbIds } from '@infra/db/db.util';
import { UserClaims } from '@infra/middleware/jwt/jwt.common';

import { getPagination } from '@shared/common/common.pagination';
import { QueryInterface } from '@shared/common/common.type';
import { toHttpSuccess } from '@shared/http/http.mapper';

import { userGroupsV1InclusionQb } from '../user-groups.v1.util';
import {
  ListUserGroupsDto,
  ListUserGroupsResponse,
} from './list-user-groups.dto';

@Injectable()
export class ListUserGroupsQuery implements QueryInterface {
  constructor(
    private db: MainDb,

    private userGroupsService: UserGroupService,
  ) {}

  async exec(
    claims: UserClaims,
    query: ListUserGroupsDto,
  ): Promise<ListUserGroupsResponse> {
    const { result, totalCount } = await this.getRaw(claims, query);

    return toHttpSuccess({
      meta: {
        pagination: getPagination(result, totalCount, query.pagination),
      },
      data: {
        userGroups: result.map((userGroup) => ({
          attributes: userGroupPgToResponse(userGroup),
          relations: {
            projects:
              userGroup.projects &&
              userGroup.projects.map((project) => ({
                attributes: projectPgToResponse(project),
              })),
            managers:
              userGroup.managers &&
              userGroup.managers.map((user) => ({
                attributes: userPgToResponse(user),
              })),
            users:
              userGroup.users &&
              userGroup.users.map((user) => ({
                attributes: userPgToResponse(user),
              })),
            createdBy: userGroup.createdBy
              ? {
                  attributes: userPgToResponse(userGroup.createdBy),
                }
              : undefined,
            updatedBy: userGroup.updatedBy
              ? {
                  attributes: userPgToResponse(userGroup.updatedBy),
                }
              : undefined,
          },
        })),
      },
    });
  }

  async getRaw(actor: UserClaims, query: ListUserGroupsDto) {
    const ids = await this.userGroupsService.getIds({
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
      .selectFrom('user_groups')
      .$call((q) => userGroupsV1InclusionQb(q, query.includes, actor))
      .$call((q) => filterQbIds(ids, q, 'user_groups.id'))
      .selectAll('user_groups')
      .execute();

    const totalCount = await this.userGroupsService.getCount({
      filter: query.countFilter,
      actor,
    });

    return {
      result,
      totalCount,
    };
  }
}

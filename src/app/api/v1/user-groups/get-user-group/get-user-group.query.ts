import { projectPgToResponse } from '@domain/base/project/project.mapper';
import { userGroupPgToResponse } from '@domain/base/user-group/user-group.mapper';
import {
  addUserGroupActorFilter,
  userGroupsTableFilter,
} from '@domain/base/user-group/user-group.utils';
import { userPgToResponse } from '@domain/base/user/user.mapper';
import { Injectable } from '@nestjs/common';

import { MainDb } from '@infra/db/db.main';
import { UserClaims } from '@infra/middleware/jwt/jwt.common';

import { QueryInterface } from '@shared/common/common.type';
import { ApiException } from '@shared/http/http.exception';
import { toHttpSuccess } from '@shared/http/http.mapper';

import { userGroupsV1InclusionQb } from '../user-groups.v1.util';
import { GetUserGroupDto, GetUserGroupResponse } from './get-user-group.dto';

@Injectable()
export class GetUserGroupQuery implements QueryInterface {
  constructor(private db: MainDb) {}

  async exec(
    claims: UserClaims,
    id: string,
    query: GetUserGroupDto,
  ): Promise<GetUserGroupResponse> {
    const userGroup = await this.getRaw(claims, id, query);

    return toHttpSuccess({
      data: {
        userGroup: {
          attributes: userGroupPgToResponse(userGroup),
          relations: {
            projects:
              userGroup.projects &&
              userGroup.projects.map((project) => ({
                attributes: projectPgToResponse(project),
              })),
            users:
              userGroup.users &&
              userGroup.users.map((user) => ({
                attributes: userPgToResponse(user),
              })),
            managers:
              userGroup.managers &&
              userGroup.managers.map((user) => ({
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
        },
      },
    });
  }

  async getRaw(actor: UserClaims, id: string, query: GetUserGroupDto) {
    const result = await this.db.read
      .selectFrom('user_groups')
      .$call((q) => userGroupsV1InclusionQb(q, query.includes, actor))
      .selectAll('user_groups')
      .where(userGroupsTableFilter)
      .where('user_groups.id', '=', id)
      .$call((q) => addUserGroupActorFilter(q, actor))
      .limit(1)
      .executeTakeFirst();

    if (!result) {
      throw new ApiException(404, 'userGroupNotFound');
    }

    return result;
  }
}

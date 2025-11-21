import { ProjectMapper } from '@domain/base/project/project.mapper';
import { UserGroupMapper } from '@domain/base/user-group/user-group.mapper';
import { userGroupsTableFilter } from '@domain/base/user-group/user-group.utils';
import { UserMapper } from '@domain/base/user/user.mapper';
import { Inject, Injectable } from '@nestjs/common';

import { READ_DB, ReadDB } from '@infra/db/db.common';

import { QueryInterface } from '@shared/common/common.type';
import { ApiException } from '@shared/http/http.exception';

import { userGroupsV1InclusionQb } from '../user-groups.v1.util';
import { GetUserGroupDto, GetUserGroupResponse } from './get-user-group.dto';

@Injectable()
export class GetUserGroupQuery implements QueryInterface {
  constructor(
    @Inject(READ_DB)
    private readDb: ReadDB,
  ) {}

  async exec(
    id: string,
    query: GetUserGroupDto,
  ): Promise<GetUserGroupResponse> {
    const userGroup = await this.getRaw(id, query);

    return {
      success: true,
      key: '',
      data: {
        userGroup: {
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
            createdBy: userGroup.createdBy
              ? {
                  attributes: UserMapper.pgToResponse(userGroup.createdBy),
                }
              : undefined,
            updatedBy: userGroup.updatedBy
              ? {
                  attributes: UserMapper.pgToResponse(userGroup.updatedBy),
                }
              : undefined,
          },
        },
      },
    };
  }

  async getRaw(id: string, query: GetUserGroupDto) {
    const result = await this.readDb
      .selectFrom('user_groups')
      .$call((q) => userGroupsV1InclusionQb(q, query.includes))
      .selectAll('user_groups')
      .where(userGroupsTableFilter)
      .where('user_groups.id', '=', id)
      .executeTakeFirst();

    if (!result) {
      throw new ApiException(404, 'userGroupNotFound');
    }

    return result;
  }
}

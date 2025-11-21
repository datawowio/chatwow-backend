import { LineAccountMapper } from '@domain/base/line-account/line-account.mapper';
import { ProjectMapper } from '@domain/base/project/project.mapper';
import { UserGroupMapper } from '@domain/base/user-group/user-group.mapper';
import { UserMapper } from '@domain/base/user/user.mapper';
import { usersTableFilter } from '@domain/base/user/user.util';
import { Inject } from '@nestjs/common';

import { READ_DB, ReadDB } from '@infra/db/db.common';

import { QueryInterface } from '@shared/common/common.type';
import { ApiException } from '@shared/http/http.exception';

import { usersV1InclusionQb } from '../users.v1.util';
import { GetUserDto, GetUserResponse } from './get-user.dto';

export class GetUserQuery implements QueryInterface {
  constructor(
    @Inject(READ_DB)
    private readDb: ReadDB,
  ) {}

  async exec(id: string, query: GetUserDto): Promise<GetUserResponse> {
    const user = await this.getRaw(id, query);

    return {
      success: true,
      key: '',
      data: {
        user: {
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
        },
      },
    };
  }

  async getRaw(id: string, query: GetUserDto) {
    const result = await this.readDb
      .selectFrom('users')
      .$call((q) => usersV1InclusionQb(q, query.includes))
      .selectAll('users')
      .where(usersTableFilter)
      .where('users.id', '=', id)
      .executeTakeFirst();

    if (!result) {
      throw new ApiException(404, 'userNotFound');
    }

    return result;
  }
}

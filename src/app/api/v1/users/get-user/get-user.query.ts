import { lineAccountPgToResponse } from '@domain/base/line-account/line-account.mapper';
import { projectPgToResponse } from '@domain/base/project/project.mapper';
import { userGroupPgToResponse } from '@domain/base/user-group/user-group.mapper';
import { userPgToResponse } from '@domain/base/user/user.mapper';
import { usersTableFilter } from '@domain/base/user/user.util';

import { MainDb } from '@infra/db/db.main';

import { QueryInterface } from '@shared/common/common.type';
import { ApiException } from '@shared/http/http.exception';
import { toHttpSuccess } from '@shared/http/http.mapper';

import { usersV1InclusionQb } from '../users.v1.util';
import { GetUserDto, GetUserResponse } from './get-user.dto';

export class GetUserQuery implements QueryInterface {
  constructor(private db: MainDb) {}

  async exec(id: string, query: GetUserDto): Promise<GetUserResponse> {
    const user = await this.getRaw(id, query);

    return toHttpSuccess({
      data: {
        user: {
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
        },
      },
    });
  }

  async getRaw(id: string, query: GetUserDto) {
    const result = await this.db.read
      .selectFrom('users')
      .$call((q) => usersV1InclusionQb(q, query.includes))
      .selectAll('users')
      .where(usersTableFilter)
      .where('users.id', '=', id)
      .limit(1)
      .executeTakeFirst();

    if (!result) {
      throw new ApiException(404, 'userNotFound');
    }

    return result;
  }
}

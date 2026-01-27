import { UserGroup } from '@domain/base/user-group/user-group.domain';
import { userGroupToResponse } from '@domain/base/user-group/user-group.mapper';
import { UserGroupService } from '@domain/base/user-group/user-group.service';
import { Injectable } from '@nestjs/common';

import { UserClaims } from '@infra/middleware/jwt/jwt.common';

import { ApiException } from '@shared/http/http.exception';
import { toHttpSuccess } from '@shared/http/http.mapper';

import { DeleteUserGroupResponse } from './delete-user-group.dto';

@Injectable()
export class DeleteUserGroupCommand {
  constructor(private userGroupService: UserGroupService) {}

  async exec(claims: UserClaims, id: string): Promise<DeleteUserGroupResponse> {
    const userGroup = await this.find(claims, id);

    await this.userGroupService.delete(userGroup.id);

    return toHttpSuccess({
      data: {
        userGroup: {
          attributes: userGroupToResponse(userGroup),
        },
      },
    });
  }

  async find(claims: UserClaims, id: string): Promise<UserGroup> {
    const user = await this.userGroupService.findOne(id, claims);
    if (!user) {
      throw new ApiException(404, 'userGroupNotFound');
    }

    return user;
  }
}

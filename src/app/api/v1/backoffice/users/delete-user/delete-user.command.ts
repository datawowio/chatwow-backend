import { User } from '@domain/base/user/user.domain';
import { userToResponse } from '@domain/base/user/user.mapper';
import { UserService } from '@domain/base/user/user.service';
import { Injectable } from '@nestjs/common';

import { MainDb } from '@infra/db/db.main';

import { ApiException } from '@shared/http/http.exception';
import { toHttpSuccess } from '@shared/http/http.mapper';

import { DeleteUserResponse } from './delete-user.dto';

@Injectable()
export class DeleteUserCommand {
  constructor(
    private db: MainDb,
    private userService: UserService,
  ) {}

  async exec(id: string): Promise<DeleteUserResponse> {
    const user = await this.find(id);
    if (user.userStatus !== 'PENDING_REGISTRATION') {
      throw new ApiException(400, 'activeUser');
    }

    await this.userService.delete(user.id);

    return toHttpSuccess({
      data: {
        user: {
          attributes: userToResponse(user),
        },
      },
    });
  }

  async find(id: string): Promise<User> {
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new ApiException(404, 'userNotFound');
    }

    return user;
  }
}

import { userToResponse } from '@domain/base/user/user.mapper';
import { UserService } from '@domain/base/user/user.service';
import { Injectable } from '@nestjs/common';

import { ApiException } from '@shared/http/http.exception';
import { toHttpSuccess } from '@shared/http/http.mapper';

import { UpdateProfileDto, UpdateProfileResponse } from './update-profile.dto';

@Injectable()
export class UpdateProfileCommand {
  constructor(private userService: UserService) {}

  async exec(userId: string, body: UpdateProfileDto): Promise<UpdateProfileResponse> {
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new ApiException(404, 'usersNotFound');
    }

    const passwordData = body.user.passwordData;
    if (passwordData) {
      if (!user.isPasswordValid(passwordData.oldPassword)) {
        throw new ApiException(400, 'invalidOldPassword');
      }

      user.edit({
        actorId: userId,
        data: {
          password: passwordData.password,
        },
      });
    }

    await this.userService.save(user);

    return toHttpSuccess({
      data: {
        user: {
          attributes: userToResponse(user),
        },
      },
    });
  }
}

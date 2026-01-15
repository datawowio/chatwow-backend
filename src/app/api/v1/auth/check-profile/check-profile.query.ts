import { UserService } from '@domain/base/user/user.service';
import { Injectable } from '@nestjs/common';

import { ApiException } from '@shared/http/http.exception';
import { toHttpSuccess } from '@shared/http/http.mapper';

import { CheckProfileDto, CheckProfileResponse } from './check-profile.dto';

@Injectable()
export class CheckProfileQuery {
  constructor(private userService: UserService) {}

  async exec(userId: string, body: CheckProfileDto): Promise<CheckProfileResponse> {
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new ApiException(400, 'usersNotFound');
    }

    return toHttpSuccess({
      data: {
        isPasswordValid: body.password
          ? user.isPasswordValid(body.password)
          : undefined,
      },
    });
  }
}

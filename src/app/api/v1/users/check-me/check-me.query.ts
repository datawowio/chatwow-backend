import { UserService } from '@domain/base/user/user.service';
import { Injectable } from '@nestjs/common';

import { ApiException } from '@shared/http/http.exception';
import { toHttpSuccess } from '@shared/http/http.mapper';

import { CheckMeDto, CheckMeResponse } from './check-me.dto';

@Injectable()
export class CheckMeQuery {
  constructor(private userService: UserService) {}

  async exec(userId: string, body: CheckMeDto): Promise<CheckMeResponse> {
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

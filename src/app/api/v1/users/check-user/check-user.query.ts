import { UserService } from '@domain/base/user/user.service';
import { Injectable } from '@nestjs/common';

import { toHttpSuccess } from '@shared/http/http.mapper';

import { CheckUserDto, CheckUserResponse } from './check-user.dto';

@Injectable()
export class CheckUserQuery {
  constructor(private userService: UserService) {}

  async exec(body: CheckUserDto): Promise<CheckUserResponse> {
    const ids = await this.userService.getIds({
      filter: body,
    });

    return toHttpSuccess({
      meta: {
        exists: !!ids.length,
      },
      data: {},
    });
  }
}

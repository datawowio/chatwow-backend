import { User } from '@domain/base/user/user.domain';
import { UserMapper } from '@domain/base/user/user.mapper';
import { UserService } from '@domain/base/user/user.service';
import { usersTableFilter } from '@domain/base/user/user.util';
import { getAccessToken, signIn } from '@domain/orchestration/auth/auth.util';
import { Inject, Injectable } from '@nestjs/common';

import { READ_DB, ReadDB } from '@infra/db/db.common';

import { CommandInterface } from '@shared/common/common.type';
import { ApiException } from '@shared/http/http.exception';
import { HttpResponseMapper } from '@shared/http/http.mapper';

import { SignInDto, SignInResponse } from './sign-in.dto';

@Injectable()
export class SignInCommand implements CommandInterface {
  constructor(
    @Inject(READ_DB)
    private readDb: ReadDB,
    private userService: UserService,
  ) {}

  async exec(body: SignInDto): Promise<SignInResponse> {
    const user = await this.find(body);

    signIn({ user, password: body.password });

    await this.save(user);

    return HttpResponseMapper.toSuccess({
      data: {
        user: {
          attributes: UserMapper.toResponse(user),
        },
        token: getAccessToken(user),
      },
    });
  }

  async find(body: SignInDto): Promise<User> {
    const domain = await this.readDb
      .selectFrom('users')
      .selectAll()
      .where('email', '=', body.email)
      .where(usersTableFilter)
      .executeTakeFirst();

    if (!domain) {
      throw new ApiException(404, 'invalidCredentials');
    }

    return UserMapper.fromPgWithState(domain);
  }

  async save(domain: User): Promise<void> {
    await this.userService.save(domain);
  }
}

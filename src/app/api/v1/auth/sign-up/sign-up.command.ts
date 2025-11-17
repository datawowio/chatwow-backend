import { User } from '@domain/base/user/user.domain';
import { UserMapper } from '@domain/base/user/user.mapper';
import { UserService } from '@domain/base/user/user.service';
import { getAccessToken, signIn } from '@domain/util/auth/auth.util';
import { Injectable } from '@nestjs/common';

import { CommandInterface } from '@shared/common/common.type';
import { ApiException } from '@shared/http/http.exception';
import { HttpResponseMapper } from '@shared/http/http.mapper';

import { SignUpResponse, SignupDto } from './sign-up.dto';

export type SignUpDomain = User;

@Injectable()
export class SignUpCommand implements CommandInterface {
  constructor(private userService: UserService) {}

  async exec(body: SignupDto): Promise<SignUpResponse> {
    const domain = User.new({
      email: body.email,
      password: body.password,
      status: 'ACTIVE',
    });

    const r = signIn({
      user: domain,
      password: body.password,
    });
    if (r.isErr()) {
      throw new ApiException(400, 'invalidAuth');
    }
    const token = getAccessToken(domain);

    await this.save(domain);

    return HttpResponseMapper.toSuccess({
      data: { user: { attributes: UserMapper.toResponse(domain) } },
      meta: {
        token,
      },
    });
  }

  async save(domain: SignUpDomain) {
    await this.userService.save(domain);
  }
}

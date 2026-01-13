import { Session } from '@domain/base/session/session.domain';
import { SessionService } from '@domain/base/session/session.service';
import { User } from '@domain/base/user/user.domain';
import {
  userFromPgWithState,
  userToResponse,
} from '@domain/base/user/user.mapper';
import { UserService } from '@domain/base/user/user.service';
import { usersTableFilter } from '@domain/base/user/user.util';
import { getAccessToken, signIn } from '@domain/logic/auth/auth.util';
import { Injectable } from '@nestjs/common';

import { MainDb } from '@infra/db/db.main';
import { TransactionService } from '@infra/db/transaction/transaction.service';

import { CommandInterface } from '@shared/common/common.type';
import { ApiException } from '@shared/http/http.exception';
import { toHttpSuccess } from '@shared/http/http.mapper';

import { SignInDto, SignInResponse } from './sign-in.dto';

type Entity = {
  session: Session;
  user: User;
};

@Injectable()
export class SignInCommand implements CommandInterface {
  constructor(
    private db: MainDb,

    private userService: UserService,
    private sessionService: SessionService,
    private transactionService: TransactionService,
  ) {}

  async exec(
    body: SignInDto,
  ): Promise<{ plainToken: string; response: SignInResponse }> {
    const user = await this.find(body);

    signIn({ user, password: body.password });
    const { session, token } = this.sessionService.newSession(user.id);

    await this.save({
      user,
      session,
    });

    return {
      response: toHttpSuccess({
        data: {
          user: {
            attributes: userToResponse(user),
          },
          token: getAccessToken(user),
        },
      }),
      plainToken: token,
    };
  }

  async find(body: SignInDto): Promise<User> {
    const domain = await this.db.read
      .selectFrom('users')
      .selectAll()
      .where('email', '=', body.email)
      .where(usersTableFilter)
      .executeTakeFirst();

    if (!domain) {
      throw new ApiException(404, 'invalidCredentials');
    }

    return userFromPgWithState(domain);
  }

  async save({ user, session }: Entity): Promise<void> {
    await this.transactionService.transaction(async () => {
      await this.userService.save(user);
      await this.sessionService.save(session);
      await this.sessionService.revokeAllOtherSession(session);
    });
  }
}

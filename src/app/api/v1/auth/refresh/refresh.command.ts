import { Session } from '@domain/base/session/session.domain';
import { SessionService } from '@domain/base/session/session.service';
import { sessionsTableFilter } from '@domain/base/session/session.util';
import { User } from '@domain/base/user/user.domain';
import {
  userFromPgWithState,
  userToResponse,
} from '@domain/base/user/user.mapper';
import { usersTableFilter } from '@domain/base/user/user.util';
import { getAccessToken } from '@domain/logic/auth/auth.util';
import { Injectable } from '@nestjs/common';

import { MainDb } from '@infra/db/db.main';
import { TransactionService } from '@infra/db/transaction/transaction.service';

import { shaHashstring } from '@shared/common/common.crypto';
import myDayjs from '@shared/common/common.dayjs';
import { CommandInterface } from '@shared/common/common.type';
import { ApiException } from '@shared/http/http.exception';
import { toHttpSuccess } from '@shared/http/http.mapper';

import { RefreshResponse } from './refresh.dto';

type Entity = {
  user: User;
  session: Session;
};

@Injectable()
export class RefreshCommand implements CommandInterface {
  constructor(
    private db: MainDb,

    private sessionService: SessionService,
    private transactionService: TransactionService,
  ) {}

  async exec(
    plainToken: string,
  ): Promise<{ plainToken: string; response: RefreshResponse }> {
    const user = await this.find(plainToken);
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

  async save(entity: Entity): Promise<void> {
    await this.transactionService.transaction(async () => {
      await this.sessionService.save(entity.session);
      await this.sessionService.revokeAllOtherSession(entity.session);
    });
  }

  async find(plainToken: string): Promise<User> {
    const user = await this.db.read
      .selectFrom('sessions')
      .innerJoin('users', 'users.id', 'sessions.user_id')
      .selectAll('users')
      .where('token_hash', '=', shaHashstring(plainToken))
      .where(usersTableFilter)
      .where(sessionsTableFilter)
      .where('sessions.expire_at', '>', myDayjs().toISOString())
      .where('revoke_at', 'is', null)
      .executeTakeFirst();

    if (!user) {
      throw new ApiException(403, 'invalidSessionToken');
    }

    return userFromPgWithState(user);
  }
}

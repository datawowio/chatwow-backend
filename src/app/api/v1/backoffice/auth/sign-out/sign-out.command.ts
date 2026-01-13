import { Session } from '@domain/base/session/session.domain';
import { sessionFromPgWithState } from '@domain/base/session/session.mapper';
import { SessionService } from '@domain/base/session/session.service';
import { sessionsTableFilter } from '@domain/base/session/session.util';
import { Injectable } from '@nestjs/common';

import { MainDb } from '@infra/db/db.main';

import { shaHashstring } from '@shared/common/common.crypto';
import myDayjs from '@shared/common/common.dayjs';
import { CommandInterface } from '@shared/common/common.type';
import { ApiException } from '@shared/http/http.exception';
import { toHttpSuccess } from '@shared/http/http.mapper';

import { SignOutResponse } from './sign-out.dto';

@Injectable()
export class SignOutCommand implements CommandInterface {
  constructor(
    private db: MainDb,
    private sessionService: SessionService,
  ) {}

  async exec(plainToken: string): Promise<SignOutResponse> {
    const session = await this.find(plainToken);

    await this.save(session);

    return toHttpSuccess({
      data: {},
    });
  }

  async save(session: Session): Promise<void> {
    await this.sessionService.revokeUserSession(session.userId);
  }

  async find(plainToken: string): Promise<Session> {
    const session = await this.db.read
      .selectFrom('sessions')
      .selectAll('sessions')
      .where('token_hash', '=', shaHashstring(plainToken))
      .where(sessionsTableFilter)
      .where('sessions.expire_at', '>', myDayjs().toISOString())
      .where('revoke_at', 'is', null)
      .executeTakeFirst();

    if (!session) {
      throw new ApiException(403, 'invalidSessionToken');
    }

    return sessionFromPgWithState(session);
  }
}

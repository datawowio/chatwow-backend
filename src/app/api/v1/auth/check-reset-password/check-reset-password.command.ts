import {
  passwordResetTokenFromPgWithState,
  passwordResetTokenToResponse,
} from '@domain/base/password-reset-token/password-reset-token.mapper';
import { passwordResetTokensTableFilter } from '@domain/base/password-reset-token/password-reset-token.util';
import {
  userFromPgWithState,
  userToResponse,
} from '@domain/base/user/user.mapper';
import { usersTableFilter } from '@domain/base/user/user.util';
import { getAccessToken } from '@domain/orchestration/auth/auth.util';
import { Injectable } from '@nestjs/common';
import { jsonObjectFrom } from 'kysely/helpers/postgres';

import { MainDb } from '@infra/db/db.main';

import { shaHashstring } from '@shared/common/common.crypto';
import myDayjs from '@shared/common/common.dayjs';
import { QueryInterface } from '@shared/common/common.type';
import { ApiException } from '@shared/http/http.exception';
import { toHttpSuccess } from '@shared/http/http.mapper';

import {
  CheckResetPasswordDto,
  CheckResetPasswordResponse,
} from './check-reset-password.dto';

@Injectable()
export class CheckResetPasswordQuery implements QueryInterface {
  constructor(private db: MainDb) {}

  async exec(
    query: CheckResetPasswordDto,
  ): Promise<CheckResetPasswordResponse> {
    const entity = await this.getRaw(query);
    if (myDayjs().isAfter(myDayjs(entity.passwordResetToken.expireAt))) {
      throw new ApiException(403, 'tokenExpired');
    }

    return toHttpSuccess({
      data: {
        user: {
          attributes: userToResponse(entity.user),
          relations: {
            passwordResetToken: {
              attributes: passwordResetTokenToResponse(
                entity.passwordResetToken,
              ),
            },
          },
        },
        token: getAccessToken(entity.user),
      },
    });
  }

  async getRaw(body: CheckResetPasswordDto) {
    const pg = await this.db.read
      .selectFrom('password_reset_tokens')
      .selectAll('password_reset_tokens')
      .select((eb) =>
        jsonObjectFrom(
          eb
            .selectFrom('users')
            .selectAll()
            .whereRef('password_reset_tokens.user_id', '=', 'users.id')
            .where(usersTableFilter)
            .where('users.user_status', '!=', 'INACTIVE'),
        ).as('user'),
      )
      .where(passwordResetTokensTableFilter)
      .where('token_hash', '=', shaHashstring(body.token))
      .where('password_reset_tokens.revoke_at', 'is', null)
      .executeTakeFirst();

    if (!pg || !pg.user) {
      throw new ApiException(403, 'invalidToken');
    }

    return {
      user: userFromPgWithState(pg.user),
      passwordResetToken: passwordResetTokenFromPgWithState(pg),
    };
  }
}

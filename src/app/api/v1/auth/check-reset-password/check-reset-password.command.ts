import { PasswordResetTokenMapper } from '@domain/base/password-reset-token/password-reset-token.mapper';
import { passwordResetTokensTableFilter } from '@domain/base/password-reset-token/password-reset-token.util';
import { UserMapper } from '@domain/base/user/user.mapper';
import { usersTableFilter } from '@domain/base/user/user.util';
import { getAccessToken } from '@domain/orchestration/auth/auth.util';
import { Inject, Injectable } from '@nestjs/common';
import { jsonObjectFrom } from 'kysely/helpers/postgres';

import { READ_DB, ReadDB } from '@infra/db/db.common';

import { shaHashstring } from '@shared/common/common.crypto';
import myDayjs from '@shared/common/common.dayjs';
import { QueryInterface } from '@shared/common/common.type';
import { ApiException } from '@shared/http/http.exception';
import { HttpResponseMapper } from '@shared/http/http.mapper';

import {
  CheckResetPasswordDto,
  CheckResetPasswordResponse,
} from './check-reset-password.dto';

@Injectable()
export class CheckResetPasswordQuery implements QueryInterface {
  constructor(
    @Inject(READ_DB)
    private readDb: ReadDB,
  ) {}

  async exec(
    query: CheckResetPasswordDto,
  ): Promise<CheckResetPasswordResponse> {
    const entity = await this.getRaw(query);
    if (myDayjs().isAfter(myDayjs(entity.passwordResetToken.expireAt))) {
      throw new ApiException(403, 'tokenExpired');
    }

    return HttpResponseMapper.toSuccess({
      data: {
        user: {
          attributes: UserMapper.toResponse(entity.user),
          relations: {
            passwordResetToken: {
              attributes: PasswordResetTokenMapper.toResponse(
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
    const pg = await this.readDb
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
      user: UserMapper.fromPgWithState(pg.user),
      passwordResetToken: PasswordResetTokenMapper.fromPgWithState(pg),
    };
  }
}

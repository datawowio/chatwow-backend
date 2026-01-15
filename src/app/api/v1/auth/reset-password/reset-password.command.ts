import { PasswordResetToken } from '@domain/base/password-reset-token/password-reset-token.domain';
import {
  passwordResetTokenFromPgWithState,
  passwordResetTokenToResponse,
} from '@domain/base/password-reset-token/password-reset-token.mapper';
import { PasswordResetTokenService } from '@domain/base/password-reset-token/password-reset-token.service';
import { passwordResetTokensTableFilter } from '@domain/base/password-reset-token/password-reset-token.util';
import { User } from '@domain/base/user/user.domain';
import {
  userFromPgWithState,
  userToResponse,
} from '@domain/base/user/user.mapper';
import { UserService } from '@domain/base/user/user.service';
import { usersTableFilter } from '@domain/base/user/user.util';
import { getAccessToken } from '@domain/logic/auth/auth.util';
import { Injectable } from '@nestjs/common';
import { jsonObjectFrom } from 'kysely/helpers/postgres';

import { MainDb } from '@infra/db/db.main';
import { TransactionService } from '@infra/db/transaction/transaction.service';

import { shaHashstring } from '@shared/common/common.crypto';
import myDayjs from '@shared/common/common.dayjs';
import { CommandInterface } from '@shared/common/common.type';
import { ApiException } from '@shared/http/http.exception';
import { toHttpSuccess } from '@shared/http/http.mapper';

import { ResetPasswordDto, ResetPasswordResponse } from './reset-password.dto';

type Entity = {
  user: User;
  passwordResetToken: PasswordResetToken;
};

@Injectable()
export class ResetPasswordCommand implements CommandInterface {
  constructor(
    private db: MainDb,

    private userService: UserService,
    private passwordResetTokenService: PasswordResetTokenService,
    private transactionService: TransactionService,
  ) {}

  async exec(body: ResetPasswordDto): Promise<ResetPasswordResponse> {
    const entity = await this.find(body);
    if (myDayjs().isAfter(myDayjs(entity.passwordResetToken.expireAt))) {
      throw new ApiException(403, 'tokenExpired');
    }

    entity.passwordResetToken.edit({
      revokeAt: myDayjs().toDate(),
    });
    entity.user.edit({
      actorId: entity.user.id,
      data: {
        password: body.user.password,
      },
    });

    if (entity.user.userStatus === 'PENDING_REGISTRATION') {
      // if new account set to active
      entity.user.edit({
        actorId: entity.user.id,
        data: {
          userStatus: 'ACTIVE',
        },
      });
    }

    await this.save(entity);

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

  async save(entity: Entity): Promise<void> {
    await this.transactionService.transaction(async () => {
      await this.userService.save(entity.user);
      await this.passwordResetTokenService.save(entity.passwordResetToken);
      await this.passwordResetTokenService.revokeAllOtherToken(
        entity.passwordResetToken,
      );
    });
  }

  async find(body: ResetPasswordDto): Promise<Entity> {
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
      .where('token_hash', '=', shaHashstring(body.passwordResetToken.token))
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

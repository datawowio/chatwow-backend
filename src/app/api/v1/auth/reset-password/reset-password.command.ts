import { PasswordResetToken } from '@domain/base/password-reset-token/password-reset-token.domain';
import { PasswordResetTokenMapper } from '@domain/base/password-reset-token/password-reset-token.mapper';
import { PasswordResetTokenService } from '@domain/base/password-reset-token/password-reset-token.service';
import { passwordResetTokensTableFilter } from '@domain/base/password-reset-token/password-reset-token.util';
import { User } from '@domain/base/user/user.domain';
import { UserMapper } from '@domain/base/user/user.mapper';
import { UserService } from '@domain/base/user/user.service';
import { usersTableFilter } from '@domain/base/user/user.util';
import { getAccessToken } from '@domain/orchestration/auth/auth.util';
import { Inject, Injectable } from '@nestjs/common';
import { jsonObjectFrom } from 'kysely/helpers/postgres';

import { READ_DB, ReadDB } from '@infra/db/db.common';
import { TransactionService } from '@infra/global/transaction/transaction.service';

import { shaHashstring } from '@shared/common/common.crypto';
import myDayjs from '@shared/common/common.dayjs';
import { CommandInterface } from '@shared/common/common.type';
import { ApiException } from '@shared/http/http.exception';
import { HttpResponseMapper } from '@shared/http/http.mapper';

import { ResetPasswordDto, ResetPasswordResponse } from './reset-password.dto';

type Entity = {
  user: User;
  passwordResetToken: PasswordResetToken;
};

@Injectable()
export class ResetPasswordCommand implements CommandInterface {
  constructor(
    @Inject(READ_DB)
    private readDb: ReadDB,

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
      .where('token_hash', '=', shaHashstring(body.passwordResetToken.token))
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

import { PasswordResetToken } from '@domain/base/password-reset-token/password-reset-token.domain';
import { newPasswordResetToken } from '@domain/base/password-reset-token/password-reset-token.factory';
import { PasswordResetTokenService } from '@domain/base/password-reset-token/password-reset-token.service';
import { User } from '@domain/base/user/user.domain';
import { userFromPgWithState } from '@domain/base/user/user.mapper';
import { UserService } from '@domain/base/user/user.service';
import { usersTableFilter } from '@domain/base/user/user.util';
import { DomainEventQueue } from '@domain/queue/domain-event/domain-event.queue';
import { Injectable } from '@nestjs/common';

import { MainDb } from '@infra/db/db.main';
import { TransactionService } from '@infra/db/transaction/transaction.service';

import { shaHashstring } from '@shared/common/common.crypto';
import { CommandInterface } from '@shared/common/common.type';
import { toHttpSuccess } from '@shared/http/http.mapper';

import {
  ForgotPasswordDto,
  ForgotPasswordResponse,
} from './forgot-password.dto';

type Entity = {
  user: User;
  passwordResetToken: PasswordResetToken;
};

@Injectable()
export class ForgotPasswordCommand implements CommandInterface {
  constructor(
    private db: MainDb,

    private userService: UserService,
    private passwordResetTokenService: PasswordResetTokenService,
    private transactionService: TransactionService,
    private domainEventQueue: DomainEventQueue,
  ) {}

  async exec(body: ForgotPasswordDto): Promise<ForgotPasswordResponse> {
    const user = await this.find(body);
    if (!user) {
      return toHttpSuccess({
        data: {},
      });
    }

    const token = shaHashstring();
    const passwordResetToken = newPasswordResetToken({
      userId: user.id,
      token,
    });

    await this.save({
      user,
      passwordResetToken,
    });

    this.domainEventQueue.jobResetPassword({
      user,
      passwordResetToken,
      plainToken: token,
      action: 'resetPassword',
    });

    // for security always success
    return toHttpSuccess({
      data: {},
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

  async find(body: ForgotPasswordDto): Promise<User | null> {
    const user = await this.db.read
      .selectFrom('users')
      .selectAll()
      .where('email', '=', body.user.email)
      .where('user_status', '=', 'ACTIVE')
      .where('role', '!=', 'USER')
      .where(usersTableFilter)
      .executeTakeFirst();

    if (!user) {
      return null;
    }

    return userFromPgWithState(user);
  }
}

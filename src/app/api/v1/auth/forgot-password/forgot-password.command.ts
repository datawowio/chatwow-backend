import { PasswordResetToken } from '@domain/base/password-reset-token/password-reset-token.domain';
import { PasswordResetTokenService } from '@domain/base/password-reset-token/password-reset-token.service';
import { User } from '@domain/base/user/user.domain';
import { UserMapper } from '@domain/base/user/user.mapper';
import { UserService } from '@domain/base/user/user.service';
import { usersTableFilter } from '@domain/base/user/user.util';
import { DomainEventQueue } from '@domain/orchestration/queue/domain-event/domain-event.queue';
import { Inject, Injectable } from '@nestjs/common';

import { READ_DB, ReadDB } from '@infra/db/db.common';
import { TransactionService } from '@infra/global/transaction/transaction.service';

import { shaHashstring } from '@shared/common/common.crypto';
import { CommandInterface } from '@shared/common/common.type';
import { HttpResponseMapper } from '@shared/http/http.mapper';

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
    @Inject(READ_DB)
    private readDb: ReadDB,

    private userService: UserService,
    private passwordResetTokenService: PasswordResetTokenService,
    private transactionService: TransactionService,
    private domainEventQueue: DomainEventQueue,
  ) {}

  async exec(body: ForgotPasswordDto): Promise<ForgotPasswordResponse> {
    const user = await this.find(body);
    if (!user) {
      return HttpResponseMapper.toSuccess({
        data: {},
      });
    }

    const token = shaHashstring();
    const passwordResetToken = PasswordResetToken.new({
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
    return HttpResponseMapper.toSuccess({
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
    const user = await this.readDb
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

    return UserMapper.fromPgWithState(user);
  }
}

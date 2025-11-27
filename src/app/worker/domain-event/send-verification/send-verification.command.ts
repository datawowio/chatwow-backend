import { UserVerification } from '@domain/base/user-verification/user-verification.domain';
import { UserVerificationService } from '@domain/base/user-verification/user-verification.service';
import type { User } from '@domain/base/user/user.domain';
import { UserService } from '@domain/base/user/user.service';
import { Injectable } from '@nestjs/common';

import { TransactionService } from '@infra/global/transaction/transaction.service';

import type { CommandInterface } from '@shared/common/common.type';

@Injectable()
export class SendVerificationQueueCommand implements CommandInterface {
  constructor(
    private userVerificationService: UserVerificationService,
    private userService: UserService,
    private transactionService: TransactionService,
  ) {}

  async exec(user: User) {
    const userVerification = UserVerification.new({
      userId: user.id,
    });

    await this.save(user, userVerification);

    return;
  }

  async save(user: User, verification: UserVerification): Promise<void> {
    await this.transactionService.transaction(async () => {
      await this.userService.save(user);
      await this.userVerificationService.revokeAll(user.id);
      await this.userVerificationService.save(verification);

      // send otp do in transaction in case failure
      await this.userVerificationService.sendVerificationMail(
        user,
        verification,
      );
    });
    return;
  }
}

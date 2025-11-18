import { User } from '@domain/base/user/user.domain';
import { UserService } from '@domain/base/user/user.service';
import { Command, CommandRunner } from 'nest-commander';

import { TransactionService } from '@infra/global/transaction/transaction.service';

@Command({
  name: 'initials:seed',
  description: 'Create record in initials table',
})
export class InitialsCliSeed extends CommandRunner {
  constructor(
    private userService: UserService,
    private transactionService: TransactionService,
  ) {
    super();
  }

  async run(_passedParams: string[]): Promise<void> {
    try {
      await this.transactionService.transaction(async () => this._initAll());
    } catch (error) {
      console.log('==================================');
      console.log(error);
      console.log('==================================');
    }
  }

  private async _initAll(): Promise<void> {
    const superAdmin = User.new({
      email: 'superadmin@example.com',
      password: 'password',
      role: 'ADMIN',
    });

    await this.userService.save(superAdmin);
  }
}

import { Injectable } from '@nestjs/common';

import { diff } from '@shared/common/common.func';
import { BaseRepo } from '@shared/common/common.repo';

import { UserOtp } from './user-otp.domain';
import { UserOtpMapper } from './user-otp.mapper';

@Injectable()
export class UserOtpRepo extends BaseRepo {
  async create(userOtp: UserOtp): Promise<void> {
    await this.db
      //
      .insertInto('user_otps')
      .values(UserOtpMapper.toPg(userOtp))
      .execute();
  }

  async update(id: string, userOtp: UserOtp): Promise<void> {
    const data = diff(userOtp.pgState, UserOtpMapper.toPg(userOtp));
    if (!data) {
      return;
    }

    await this.db
      //
      .updateTable('user_otps')
      .set(data)
      .where('id', '=', id)
      .execute();
  }

  async findOne(id: string): Promise<UserOtp | null> {
    const userOtpPg = await this.readDb
      .selectFrom('user_otps')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();

    if (!userOtpPg) {
      return null;
    }

    const userOtp = UserOtpMapper.fromPgWithState(userOtpPg);
    return userOtp;
  }

  async delete(id: string): Promise<void> {
    await this.db
      //
      .deleteFrom('user_otps')
      .where('id', '=', id)
      .execute();
  }
}

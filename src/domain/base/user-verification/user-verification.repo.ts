import { Injectable } from '@nestjs/common';

import { diff } from '@shared/common/common.func';
import { BaseRepo } from '@shared/common/common.repo';

import { UserVerification } from './user-verification.domain';
import { UserVerificationMapper } from './user-verification.mapper';

@Injectable()
export class UserVerificationRepo extends BaseRepo {
  async create(userVerification: UserVerification): Promise<void> {
    await this.db
      //
      .insertInto('user_verifications')
      .values(UserVerificationMapper.toPg(userVerification))
      .execute();
  }

  async update(id: string, userVerification: UserVerification): Promise<void> {
    const data = diff(
      userVerification.pgState,
      UserVerificationMapper.toPg(userVerification),
    );
    if (!data) {
      return;
    }

    await this.db
      //
      .updateTable('user_verifications')
      .set(data)
      .where('id', '=', id)
      .execute();
  }

  async findOne(id: string): Promise<UserVerification | null> {
    const userVerificationPg = await this.readDb
      .selectFrom('user_verifications')
      .selectAll()
      .where('id', '=', id)
      .limit(1)
      .executeTakeFirst();

    if (!userVerificationPg) {
      return null;
    }

    const userVerification =
      UserVerificationMapper.fromPgWithState(userVerificationPg);
    return userVerification;
  }

  async delete(id: string): Promise<void> {
    await this.db
      //
      .deleteFrom('user_verifications')
      .where('id', '=', id)
      .execute();
  }

  async deleteAll(userId: string) {
    await this.db
      //
      .deleteFrom('user_verifications')
      .where('user_id', '=', userId)
      .execute();
  }
}

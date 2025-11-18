import { Injectable } from '@nestjs/common';

import { diff } from '@shared/common/common.func';
import { BaseRepo } from '@shared/common/common.repo';

import { User } from './user.domain';
import { UserMapper } from './user.mapper';
import { usersTableFilter } from './user.util';

@Injectable()
export class UserRepo extends BaseRepo {
  async create(user: User): Promise<void> {
    await this.db
      //
      .insertInto('users')
      .values(UserMapper.toPg(user))
      .execute();
  }

  async update(id: string, user: User): Promise<void> {
    const data = diff(user.pgState, UserMapper.toPg(user));
    if (!data) {
      return;
    }

    await this.db
      //
      .updateTable('users')
      .set(data)
      .where('id', '=', id)
      .execute();
  }

  async findOne(id: string): Promise<User | null> {
    const userPg = await this.readDb
      .selectFrom('users')
      .selectAll()
      .where('id', '=', id)
      .where(usersTableFilter)
      .executeTakeFirst();

    if (!userPg) {
      return null;
    }

    const user = UserMapper.fromPgWithState(userPg);
    return user;
  }

  async delete(id: string): Promise<void> {
    await this.db
      //
      .deleteFrom('users')
      .where('id', '=', id)
      .execute();
  }
}

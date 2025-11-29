import { Injectable } from '@nestjs/common';

import { MainDb } from '@infra/db/db.main';

import { userGroupUserToPg } from './user-group-user.mapper';

@Injectable()
export class UserGroupUserService {
  constructor(private db: MainDb) {}

  async saveUserRelations(userId: string, userGroupIds: string[]) {
    await this.db.write
      .deleteFrom('user_group_users')
      .where('user_group_users.user_id', '=', userId)
      .execute();

    if (!userGroupIds.length) {
      return;
    }

    const insertData = userGroupIds.map((userGroupId) =>
      userGroupUserToPg({
        userGroupId,
        userId,
      }),
    );
    await this.db.write
      //
      .insertInto('user_group_users')
      .values(insertData)
      .execute();
  }

  async saveUserGroupRelations(userGroupId: string, userIds: string[]) {
    await this.db.write
      .deleteFrom('user_group_users')
      .where('user_group_users.user_group_id', '=', userGroupId)
      .execute();

    if (!userIds.length) {
      return;
    }

    const insertData = userIds.map((userId) =>
      userGroupUserToPg({
        userGroupId,
        userId,
      }),
    );
    await this.db.write
      //
      .insertInto('user_group_users')
      .values(insertData)
      .execute();
  }
}

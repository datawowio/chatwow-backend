import { Injectable } from '@nestjs/common';

import { MainDb } from '@infra/db/db.main';

import { userGroupManagerToPg } from './user-group-manager.mapper';

@Injectable()
export class UserGroupManagerService {
  constructor(private db: MainDb) {}

  async saveUserRelations(userId: string, userGroupIds: string[]) {
    await this.db.write
      .deleteFrom('user_group_managers')
      .where('user_group_managers.user_id', '=', userId)
      .execute();

    if (!userGroupIds.length) {
      return;
    }

    const insertData = userGroupIds.map((userGroupId) =>
      userGroupManagerToPg({
        userGroupId,
        userId,
      }),
    );
    await this.db.write
      //
      .insertInto('user_group_managers')
      .values(insertData)
      .execute();
  }

  async saveUserGroupRelations(userGroupId: string, userIds: string[]) {
    await this.db.write
      .deleteFrom('user_group_managers')
      .where('user_group_managers.user_group_id', '=', userGroupId)
      .execute();

    if (!userIds.length) {
      return;
    }

    const insertData = userIds.map((userId) =>
      userGroupManagerToPg({
        userGroupId,
        userId,
      }),
    );
    await this.db.write
      //
      .insertInto('user_group_managers')
      .values(insertData)
      .execute();
  }
}

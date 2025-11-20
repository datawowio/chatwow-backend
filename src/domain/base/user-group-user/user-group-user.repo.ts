import { Injectable } from '@nestjs/common';

import { BaseRepo } from '@shared/common/common.repo';

import { UserGroupUserMapper } from './user-group-user.mapper';

@Injectable()
export class UserGroupUserRepo extends BaseRepo {
  async saveUserRelations(userId: string, userGroupIds: string[]) {
    await this.db
      .deleteFrom('user_group_users')
      .where('user_group_users.user_id', '=', userId)
      .execute();

    if (!userGroupIds.length) {
      return;
    }

    const insertData = userGroupIds.map((userGroupId) =>
      UserGroupUserMapper.toPg({
        userGroupId,
        userId,
      }),
    );
    await this.db
      //
      .insertInto('user_group_users')
      .values(insertData)
      .execute();
  }

  async saveUserGroupRelations(userGroupId: string, userIds: string[]) {
    await this.db
      .deleteFrom('user_group_users')
      .where('user_group_users.user_group_id', '=', userGroupId)
      .execute();

    if (!userIds.length) {
      return;
    }

    const insertData = userIds.map((userId) =>
      UserGroupUserMapper.toPg({
        userGroupId,
        userId,
      }),
    );
    await this.db
      //
      .insertInto('user_group_users')
      .values(insertData)
      .execute();
  }
}

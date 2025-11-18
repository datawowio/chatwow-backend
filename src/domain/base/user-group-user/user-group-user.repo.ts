import { Injectable } from '@nestjs/common';

import { uuidV7 } from '@shared/common/common.crypto';
import { BaseRepo } from '@shared/common/common.repo';

import { UserGroupUserMapper } from './user-group-user.mapper';

@Injectable()
export class UserGroupUserRepo extends BaseRepo {
  async saveUserRelations(userId: string, userGroupIds: string[]) {
    await this.db
      .deleteFrom('user_group_users')
      .where('user_group_users.user_id', '=', userId)
      .execute();

    const insertData = userGroupIds.map((userGroupId) =>
      UserGroupUserMapper.toPg({
        id: uuidV7(),
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

  async saveProjectRelations(userGroupId: string, userIds: string[]) {
    await this.db
      .deleteFrom('user_group_users')
      .where('user_group_users.user_group_id', '=', userGroupId)
      .execute();

    const insertData = userIds.map((userId) =>
      UserGroupUserMapper.toPg({
        id: uuidV7(),
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

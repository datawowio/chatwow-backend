import { Injectable } from '@nestjs/common';

import { uuidV7 } from '@shared/common/common.crypto';
import { BaseRepo } from '@shared/common/common.repo';

import { UserGroupProjectMapper } from './user-group-project.mapper';

@Injectable()
export class UserGroupProjectRepo extends BaseRepo {
  async saveUserGroupRelations(userGroupId: string, projectIds: string[]) {
    await this.db
      .deleteFrom('user_group_projects')
      .where('user_group_projects.user_group_id', '=', userGroupId)
      .execute();

    const insertData = projectIds.map((projectId) =>
      UserGroupProjectMapper.toPg({
        id: uuidV7(),
        userGroupId,
        projectId,
      }),
    );
    await this.db
      .insertInto('user_group_projects')
      .values(insertData)
      .execute();
  }

  async saveProjectRelations(projectId: string, userGroupIds: string[]) {
    await this.db
      .deleteFrom('user_group_projects')
      .where('user_group_projects.project_id', '=', projectId)
      .execute();

    const insertData = userGroupIds.map((userGroupId) =>
      UserGroupProjectMapper.toPg({
        id: uuidV7(),
        userGroupId,
        projectId,
      }),
    );
    await this.db
      .insertInto('user_group_projects')
      .values(insertData)
      .execute();
  }
}

import { Injectable } from '@nestjs/common';

import { BaseRepo } from '@shared/common/common.repo';

import { UserGroupProjectMapper } from './user-group-project.mapper';

@Injectable()
export class UserGroupProjectRepo extends BaseRepo {
  async saveUserGroupRelations(userGroupId: string, projectIds: string[]) {
    await this.db
      .deleteFrom('user_group_projects')
      .where('user_group_projects.user_group_id', '=', userGroupId)
      .execute();

    if (!projectIds.length) {
      return;
    }

    const insertData = projectIds.map((projectId) =>
      UserGroupProjectMapper.toPg({
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

    if (!userGroupIds.length) {
      return;
    }

    const insertData = userGroupIds.map((userGroupId) =>
      UserGroupProjectMapper.toPg({
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

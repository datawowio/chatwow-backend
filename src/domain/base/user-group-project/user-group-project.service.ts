import { Injectable } from '@nestjs/common';

import { MainDb } from '@infra/db/db.main';

import { userGroupProjectToPg } from './user-group-project.mapper';

@Injectable()
export class UserGroupProjectService {
  constructor(private db: MainDb) {}

  async saveUserGroupRelations(userGroupId: string, projectIds: string[]) {
    await this.db.write
      .deleteFrom('user_group_projects')
      .where('user_group_projects.user_group_id', '=', userGroupId)
      .execute();

    if (!projectIds.length) {
      return;
    }

    const insertData = projectIds.map((projectId) =>
      userGroupProjectToPg({
        userGroupId,
        projectId,
      }),
    );
    await this.db.write
      .insertInto('user_group_projects')
      .values(insertData)
      .execute();
  }

  async saveProjectRelations(projectId: string, userGroupIds: string[]) {
    await this.db.write
      .deleteFrom('user_group_projects')
      .where('user_group_projects.project_id', '=', projectId)
      .execute();

    if (!userGroupIds.length) {
      return;
    }

    const insertData = userGroupIds.map((userGroupId) =>
      userGroupProjectToPg({
        userGroupId,
        projectId,
      }),
    );
    await this.db.write
      .insertInto('user_group_projects')
      .values(insertData)
      .execute();
  }
}

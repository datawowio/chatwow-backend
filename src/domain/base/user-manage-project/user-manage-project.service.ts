import { Injectable } from '@nestjs/common';

import { MainDb } from '@infra/db/db.main';

import myDayjs from '@shared/common/common.dayjs';

import { userManageProjectToPg } from './user-manage-project.mapper';

@Injectable()
export class UserManageProjectService {
  constructor(private readonly db: MainDb) {}

  async saveUserRelations(userId: string, projectIds: string[]) {
    await this.db.write
      .deleteFrom('user_manage_projects')
      .where('user_manage_projects.user_id', '=', userId)
      .execute();

    if (!projectIds.length) {
      return;
    }

    const insertData = projectIds.map((projectId) =>
      userManageProjectToPg({
        createdAt: myDayjs().toDate(),
        userId,
        projectId,
      }),
    );
    await this.db.write
      .insertInto('user_manage_projects')
      .values(insertData)
      .execute();
  }

  async saveProjectRelations(projectId: string, userIds: string[]) {
    await this.db.write
      .deleteFrom('user_manage_projects')
      .where('user_manage_projects.project_id', '=', projectId)
      .execute();

    if (!userIds.length) {
      return;
    }

    const insertData = userIds.map((userId) =>
      userManageProjectToPg({
        createdAt: myDayjs().toDate(),
        userId,
        projectId,
      }),
    );
    await this.db.write
      .insertInto('user_manage_projects')
      .values(insertData)
      .execute();
  }
}

import { Injectable } from '@nestjs/common';

import myDayjs from '@shared/common/common.dayjs';
import { BaseRepo } from '@shared/common/common.repo';

import { UserManageProjectMapper } from './user-manage-project.mapper';

@Injectable()
export class UserManageProjectRepo extends BaseRepo {
  async saveUserRelations(userId: string, projectIds: string[]) {
    await this.db
      .deleteFrom('user_manage_projects')
      .where('user_manage_projects.user_id', '=', userId)
      .execute();

    if (!projectIds.length) {
      return;
    }

    const insertData = projectIds.map((projectId) =>
      UserManageProjectMapper.toPg({
        createdAt: myDayjs().toDate(),
        userId,
        projectId,
      }),
    );
    await this.db
      .insertInto('user_manage_projects')
      .values(insertData)
      .execute();
  }

  async saveProjectRelations(projectId: string, userIds: string[]) {
    await this.db
      .deleteFrom('user_manage_projects')
      .where('user_manage_projects.project_id', '=', projectId)
      .execute();

    if (!userIds.length) {
      return;
    }

    const insertData = userIds.map((userId) =>
      UserManageProjectMapper.toPg({
        createdAt: myDayjs().toDate(),
        userId,
        projectId,
      }),
    );
    await this.db
      .insertInto('user_manage_projects')
      .values(insertData)
      .execute();
  }
}

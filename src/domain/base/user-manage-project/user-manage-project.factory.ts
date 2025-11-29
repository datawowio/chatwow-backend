import myDayjs from '@shared/common/common.dayjs';

import { userManageProjectFromPlain } from './user-manage-project.mapper';
import type { UserManageProjectNewData } from './user-manage-project.type';

export function newUserManageProject(data: UserManageProjectNewData) {
  return userManageProjectFromPlain({
    createdAt: myDayjs().toDate(),
    projectId: data.projectId,
    userId: data.userId,
  });
}

export function newUserManageProjects(data: UserManageProjectNewData[]) {
  return data.map((d) => newUserManageProject(d));
}

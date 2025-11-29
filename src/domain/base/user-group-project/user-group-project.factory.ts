import { uuidV7 } from '@shared/common/common.crypto';
import { isDefined } from '@shared/common/common.validator';

import { userGroupProjectFromPlain } from './user-group-project.mapper';
import type {
  UserGroupProjectNewData,
  UserGroupProjectPlain,
} from './user-group-project.type';

export function newUserGroupProject(data: UserGroupProjectNewData) {
  return userGroupProjectFromPlain({
    projectId: data.projectId,
    userGroupId: data.userGroupId,
  });
}

export function newUserGroupProjects(data: UserGroupProjectNewData[]) {
  return data.map((d) => newUserGroupProject(d));
}

export function mockUserGroupProject(data: Partial<UserGroupProjectPlain>) {
  return userGroupProjectFromPlain({
    projectId: isDefined(data.projectId) ? data.projectId : uuidV7(),
    userGroupId: isDefined(data.userGroupId) ? data.userGroupId : uuidV7(),
  });
}

export function mockUserGroupProjects(
  amount: number,
  data: Partial<UserGroupProjectPlain>,
) {
  return Array(amount)
    .fill(0)
    .map(() => mockUserGroupProject(data));
}

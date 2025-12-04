import { uuidV7 } from '@shared/common/common.crypto';
import { isDefined } from '@shared/common/common.validator';

import { userGroupManagerFromPlain } from './user-group-manager.mapper';
import type { UserGroupManagerPlain } from './user-group-manager.type';

export function mockUserGroupManager(data: Partial<UserGroupManagerPlain>) {
  return userGroupManagerFromPlain({
    userId: isDefined(data.userId) ? data.userId : uuidV7(),
    userGroupId: isDefined(data.userGroupId) ? data.userGroupId : uuidV7(),
  });
}

export function mockUserGroupManagers(
  amount: number,
  data: Partial<UserGroupManagerPlain>,
) {
  return Array(amount)
    .fill(0)
    .map(() => mockUserGroupManager(data));
}

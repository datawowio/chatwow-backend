import { uuidV7 } from '@shared/common/common.crypto';
import { isDefined } from '@shared/common/common.validator';

import { userGroupUserFromPlain } from './user-group-user.mapper';
import type { UserGroupUserPlain } from './user-group-user.type';

export function mockUserGroupUser(data: Partial<UserGroupUserPlain>) {
  return userGroupUserFromPlain({
    userId: isDefined(data.userId) ? data.userId : uuidV7(),
    userGroupId: isDefined(data.userGroupId) ? data.userGroupId : uuidV7(),
  });
}

export function mockUserGroupUsers(
  amount: number,
  data: Partial<UserGroupUserPlain>,
) {
  return Array(amount)
    .fill(0)
    .map(() => mockUserGroupUser(data));
}

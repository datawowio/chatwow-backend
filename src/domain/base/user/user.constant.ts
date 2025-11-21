import type { UserRole, UserStatus } from '@infra/db/db';

import type { UnionArray } from '@shared/common/common.type';

export const USER_ROLE: UnionArray<UserRole> = ['ADMIN', 'USER', 'MANAGER'];
export const USER_STATUS: UnionArray<UserStatus> = [
  'ACTIVE',
  'INACTIVE',
  'PENDING_REGISTRATION',
];

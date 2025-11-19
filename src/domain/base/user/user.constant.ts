import type { UserRole } from '@infra/db/db';

import type { UnionArray } from '@shared/common/common.type';

export const USER_ROLE_TUPLE: UnionArray<UserRole> = ['ADMIN', 'USER'];

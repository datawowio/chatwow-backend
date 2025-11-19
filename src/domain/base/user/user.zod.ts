import type { UserRole, UserStatus } from '@infra/db/db';

import type { PaginationQuery } from '@shared/common/common.pagintaion';
import type { ParsedSort } from '@shared/common/common.type';

export type UserSortKey = 'id' | 'createdAt' | 'email';
export type UserQueryOptions = {
  filter?: {
    email?: string;
    role?: UserRole;
    userStatus?: UserStatus;
  };
  sort?: ParsedSort<UserSortKey>;
  pagination?: PaginationQuery;
};

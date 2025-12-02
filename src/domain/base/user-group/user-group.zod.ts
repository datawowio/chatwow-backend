import z from 'zod';

import { UserClaims } from '@infra/middleware/jwt/jwt.common';

import type { PaginationQuery } from '@shared/common/common.pagination';
import { parmUuidsZod } from '@shared/common/common.zod';
import { getSortZod } from '@shared/zod/zod.util';

export const userGroupFilterZod = z
  .object({
    groupName: z.string().optional(),
    userIds: parmUuidsZod.optional(),
    projectIds: parmUuidsZod.optional(),
    search: z.string().optional(),
  })
  .optional();
export const userGroupSortZod = getSortZod(['id', 'createdAt', 'groupName']);

export type UserGroupFilterOptions = {
  filter?: z.infer<typeof userGroupFilterZod>;
  actor?: UserClaims;
};
export type UserGroupQueryOptions = {
  actor?: UserClaims;
  options?: {
    filter?: z.infer<typeof userGroupFilterZod>;
    sort?: z.infer<typeof userGroupSortZod>;
    pagination?: PaginationQuery;
  };
};

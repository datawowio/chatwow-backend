import z from 'zod';

import { UserClaims } from '@infra/middleware/jwt/jwt.common';

import type { PaginationQuery } from '@shared/common/common.pagination';
import { parmUuidsZod } from '@shared/common/common.zod';
import { getSortZod } from '@shared/zod/zod.util';

export const aiUsageUserGroupFilterZod = z
  .object({
    aiUsageIds: parmUuidsZod.optional(),
    userGroupIds: parmUuidsZod.optional(),
  })
  .optional();
export const aiUsageUserGroupSortZod = getSortZod([
  'id',
  'createdAt',
  'tokenUsed',
  'chatCount',
]);

export type AiUsageUserGroupFilterOptions = {
  filter?: z.infer<typeof aiUsageUserGroupFilterZod>;
  actor?: UserClaims;
};
export type AiUsageUserGroupQueryOptions = {
  actor?: UserClaims;
  options?: {
    filter?: z.infer<typeof aiUsageUserGroupFilterZod>;
    sort?: z.infer<typeof aiUsageUserGroupSortZod>;
    pagination?: PaginationQuery;
  };
};

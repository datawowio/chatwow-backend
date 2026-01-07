import z from 'zod';

import { UserClaims } from '@infra/middleware/jwt/jwt.common';

import type { PaginationQuery } from '@shared/common/common.pagination';
import { parmUuidsZod } from '@shared/common/common.zod';
import { getSortZod } from '@shared/zod/zod.util';

export const aiUsageFilterZod = z
  .object({
    userIds: parmUuidsZod.optional(),
    projectIds: parmUuidsZod.optional(),
    refTable: z.string().optional(),
    refId: z.string().optional(),
  })
  .optional();
export const aiUsageSortZod = getSortZod([
  'id',
  'createdAt',
  'aiRequestAt',
  'aiReplyAt',
  'tokenUsed',
  'confidence',
]);

export type AiUsageFilterOptions = {
  filter?: z.infer<typeof aiUsageFilterZod>;
  actor?: UserClaims;
};
export type AiUsageQueryOptions = {
  actor?: UserClaims;
  options?: {
    filter?: z.infer<typeof aiUsageFilterZod>;
    sort?: z.infer<typeof aiUsageSortZod>;
    pagination?: PaginationQuery;
  };
};

import z from 'zod';

import type { PaginationQuery } from '@shared/common/common.pagintaion';
import { parmUuidsZod } from '@shared/common/common.zod';
import { getSortZod } from '@shared/zod/zod.util';

export const userGroupFilterZod = z
  .object({
    groupName: z.string().optional(),
    userIds: parmUuidsZod.optional(),
    search: z.string().optional(),
  })
  .optional();
export const userGroupSortZod = getSortZod(['id', 'createdAt', 'groupName']);

export type UserGroupQueryOptions = {
  filter?: z.infer<typeof userGroupFilterZod>;
  sort?: z.infer<typeof userGroupSortZod>;
  pagination?: PaginationQuery;
};
export type UserGroupCountQueryOptions = Pick<UserGroupQueryOptions, 'filter'>;

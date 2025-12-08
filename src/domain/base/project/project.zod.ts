import z from 'zod';

import { UserClaims } from '@infra/middleware/jwt/jwt.common';

import type { PaginationQuery } from '@shared/common/common.pagination';
import { parmUuidsZod } from '@shared/common/common.zod';
import { getSortZod } from '@shared/zod/zod.util';

import { PROJECT_STATUS } from './project.constant';

export const projectFilterZod = z
  .object({
    projectName: z.string().optional(),
    projectStatus: z.enum(PROJECT_STATUS).optional(),
    userGroupIds: parmUuidsZod.optional(),
    manageUserIds: parmUuidsZod.optional(),
    search: z.string().optional(),
    userId: z.string().optional(),
    lineAccountId: z.string().optional(),
  })
  .optional();
export const projectSortZod = getSortZod(['id', 'projectName', 'createdAt']);

export type ProjectFilterOptions = {
  filter?: z.infer<typeof projectFilterZod>;
  actor?: UserClaims;
};
export type ProjectQueryOptions = {
  actor?: UserClaims;
  options?: {
    filter?: z.infer<typeof projectFilterZod>;
    sort?: z.infer<typeof projectSortZod>;
    pagination?: PaginationQuery;
  };
};

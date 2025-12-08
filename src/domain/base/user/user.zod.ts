import z from 'zod';

import type { PaginationQuery } from '@shared/common/common.pagination';
import { toSplitCommaArray } from '@shared/common/common.transformer';
import { parmUuidsZod } from '@shared/common/common.zod';
import { getSortZod } from '@shared/zod/zod.util';

import { USER_ROLE, USER_STATUS } from './user.constant';

export const userFilterZod = z
  .object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().optional(),
    role: z.enum(USER_ROLE).optional(),
    roles: z
      .preprocess(toSplitCommaArray, z.array(z.enum(USER_ROLE)))
      .optional(),
    userStatus: z.enum(USER_STATUS).optional(),
    userGroupIds: parmUuidsZod.optional(),
    search: z.string().optional(),
  })
  .optional();
export const userSortZod = getSortZod([
  'id',
  'firstName',
  'lastName',
  'email',
  'createdAt',
  'lastSignedInAt',
]);

export type UserQueryOptions = {
  filter?: z.infer<typeof userFilterZod>;
  sort?: z.infer<typeof userSortZod>;
  pagination?: PaginationQuery;
};
export type UserCountQueryOptions = Pick<UserQueryOptions, 'filter'>;

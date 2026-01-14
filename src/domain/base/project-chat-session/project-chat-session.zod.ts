import z from 'zod';

import type { PaginationQuery } from '@shared/common/common.pagination';
import { parmUuidsZod } from '@shared/common/common.zod';
import { getSortZod } from '@shared/zod/zod.util';

export const projectChatSessionFilterZod = z.object({
  projectId: z.string().uuid().optional(),
  projectIds: parmUuidsZod.optional(),
  userId: z.string().uuid().optional(),
  userIds: parmUuidsZod.optional(),
});

export const projectChatSessionSortZod = getSortZod(['id', 'createdAt']);

export type ProjectChatSessionFilterOptions = z.infer<
  typeof projectChatSessionFilterZod
>;

export type ProjectChatSessionQueryOptions = {
  filter?: ProjectChatSessionFilterOptions;
  sort?: z.infer<typeof projectChatSessionSortZod>;
  pagination?: PaginationQuery;
};
export type ProjectChatSessionCountQueryOptions = Pick<
  ProjectChatSessionQueryOptions,
  'filter'
>;

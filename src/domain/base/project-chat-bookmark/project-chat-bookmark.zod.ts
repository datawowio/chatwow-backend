import z from 'zod';

import type { PaginationQuery } from '@shared/common/common.pagination';
import { parmUuidsZod } from '@shared/common/common.zod';
import { getSortZod } from '@shared/zod/zod.util';

export const projectChatBookmarkFilterZod = z.object({
  projectIds: parmUuidsZod.optional(),
  createdById: z.string().uuid().optional(),
  search: z.string().optional(),
});

export const projectChatBookmarkSortZod = getSortZod(['id', 'createdAt']);

export type ProjectChatBookmarkFilterOptions = z.infer<
  typeof projectChatBookmarkFilterZod
>;
export type ProjectChatBookmarkQueryOptions = {
  filter?: ProjectChatBookmarkFilterOptions;
  sort?: z.infer<typeof projectChatBookmarkSortZod>;
  pagination?: PaginationQuery;
};

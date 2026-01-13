import z from 'zod';

import type { PaginationQuery } from '@shared/common/common.pagination';
import { getSortZod } from '@shared/zod/zod.util';

export const projectChatBookmarkFilterZod = z.object({
  projectId: z.string().uuid().optional(),
  createdById: z.string().uuid().optional(),
  search: z.string().optional(),
});

export const projectChatBookmarkSortZod = getSortZod(['id', 'createdAt']);

export type ProjectChatBookmarkQueryOptions = {
  filter?: z.infer<typeof projectChatBookmarkFilterZod>;
  sort?: z.infer<typeof projectChatBookmarkSortZod>;
  pagination?: PaginationQuery;
};
export type ProjectChatBookmarkCountQueryOptions = Pick<
  ProjectChatBookmarkQueryOptions,
  'filter'
>;

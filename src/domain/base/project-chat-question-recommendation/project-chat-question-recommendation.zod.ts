import z from 'zod';

import type { PaginationQuery } from '@shared/common/common.pagination';
import { parmUuidsZod } from '@shared/common/common.zod';
import { getSortZod } from '@shared/zod/zod.util';

export const projectChatQuestionRecommendationFilterZod = z.object({
  projectIds: parmUuidsZod.optional(),
  projectId: z.string().uuid().optional(),
  userId: z.string().uuid().optional(),
  search: z.string().optional(),
});

export const projectChatQuestionRecommendationSortZod = getSortZod([
  'id',
  'createdAt',
]);

export type ProjectChatQuestionRecommendationQueryOptions = {
  filter?: z.infer<typeof projectChatQuestionRecommendationFilterZod>;
  sort?: z.infer<typeof projectChatQuestionRecommendationSortZod>;
  pagination?: PaginationQuery;
};
export type ProjectChatQuestionRecommendationCountQueryOptions = Pick<
  ProjectChatQuestionRecommendationQueryOptions,
  'filter'
>;

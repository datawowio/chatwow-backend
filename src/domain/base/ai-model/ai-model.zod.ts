import z from 'zod';

import { UserClaims } from '@infra/middleware/jwt/jwt.common';

import type { PaginationQuery } from '@shared/common/common.pagination';
import { getSortZod } from '@shared/zod/zod.util';

import { AI_MODEL_NAME } from './ai-model.constant';

export const aiModelFilterZod = z
  .object({
    aiModels: z.array(z.enum(AI_MODEL_NAME)).optional(),
  })
  .optional();

export const aiModelSortZod = getSortZod([
  'aiModelName',
  'createdAt',
  'updatedAt',
  'pricePerToken',
]);

export type AiModelFilterOptions = {
  filter?: z.infer<typeof aiModelFilterZod>;
  actor?: UserClaims;
};
export type AiModelQueryOptions = {
  actor?: UserClaims;
  options?: {
    filter?: z.infer<typeof aiModelFilterZod>;
    sort?: z.infer<typeof aiModelSortZod>;
    pagination?: PaginationQuery;
  };
};

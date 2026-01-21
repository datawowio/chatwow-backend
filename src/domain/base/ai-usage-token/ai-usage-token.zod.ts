import z from 'zod';

import type { PaginationQuery } from '@shared/common/common.pagination';
import { parmUuidsZod } from '@shared/common/common.zod';
import { getSortZod } from '@shared/zod/zod.util';

import { AI_MODEL_NAME } from '../ai-model/ai-model.constant';

export const aiUsageTokenFilterZod = z.object({
  aiUsageId: z.string().uuid().optional(),
  aiUsageIds: parmUuidsZod.optional(),
  aiModelName: z.enum(AI_MODEL_NAME).optional(),
  minInputTokens: z.coerce.number().int().min(0).optional(),
  maxInputTokens: z.coerce.number().int().min(0).optional(),
  minOutputTokens: z.coerce.number().int().min(0).optional(),
  maxOutputTokens: z.coerce.number().int().min(0).optional(),
  minTotalTokens: z.coerce.number().int().min(0).optional(),
  maxTotalTokens: z.coerce.number().int().min(0).optional(),
  minTotalPrice: z.coerce.number().min(0).optional(),
  maxTotalPrice: z.coerce.number().min(0).optional(),
});

export const aiUsageTokenSortZod = getSortZod([
  'id',
  'createdAt',
  'inputTokens',
  'outputTokens',
  'totalTokens',
  'totalPrice',
  'initialTotalPrice',
]);

export type AiUsageTokenQueryOptions = {
  filter?: z.infer<typeof aiUsageTokenFilterZod>;
  sort?: z.infer<typeof aiUsageTokenSortZod>;
  pagination?: PaginationQuery;
};
export type AiUsageTokenCountQueryOptions = Pick<
  AiUsageTokenQueryOptions,
  'filter'
>;

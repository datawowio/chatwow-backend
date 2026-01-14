import z from 'zod';

import type { PaginationQuery } from '@shared/common/common.pagination';
import { toSplitCommaArray } from '@shared/common/common.transformer';
import { parmUuidsZod } from '@shared/common/common.zod';
import { getSortZod } from '@shared/zod/zod.util';

import { CHAT_SENDER } from './project-chat-log.constant';

export const projectChatLogFilterZod = z.object({
  projectChatSessionId: z.string().uuid().optional(),
  projectChatSessionIds: parmUuidsZod.optional(),
  idGt: z.string().uuid().optional(),
  idLt: z.string().uuid().optional(),
  chatSender: z.enum(CHAT_SENDER).optional(),
  userId: z.string().uuid().optional(),
  chatSenders: z
    .preprocess(toSplitCommaArray, z.array(z.enum(CHAT_SENDER)))
    .optional(),
  parentId: z.string().uuid().optional(),
});

export const projectChatLogSortZod = getSortZod(['id', 'createdAt']);

export type ProjectChatLogFilterOptions = z.infer<
  typeof projectChatLogFilterZod
>;

export type ProjectChatLogQueryOptions = {
  filter?: ProjectChatLogFilterOptions;
  sort?: z.infer<typeof projectChatLogSortZod>;
  pagination?: PaginationQuery;
};
export type ProjectChatLogCountQueryOptions = Pick<
  ProjectChatLogQueryOptions,
  'filter'
>;

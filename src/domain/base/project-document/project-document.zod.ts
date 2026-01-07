import z from 'zod';

import { UserClaims } from '@infra/middleware/jwt/jwt.common';

import type { PaginationQuery } from '@shared/common/common.pagination';
import { toSplitCommaArray } from '@shared/common/common.transformer';
import { parmUuidsZod } from '@shared/common/common.zod';
import { getSortZod } from '@shared/zod/zod.util';

import { PROJECT_DOCUMENT_STATUS } from './project-document.constant';

export type ProjectDocumentSortKey = 'id';

export const projectDocumentFilterZod = z
  .object({
    documentStatus: z.enum(PROJECT_DOCUMENT_STATUS).optional(),
    projectName: z.string().optional(),
    search: z.string().optional(),
    projectIds: parmUuidsZod.optional(),
    storedFileExtensions: z
      .preprocess(toSplitCommaArray, z.array(z.string()))
      .optional(),
  })
  .optional();
export const projectDocumentSortZod = getSortZod([
  'id',
  'documentStatus',
  'createdAt',
]);

export type ProjectDocumentFilterOptions = {
  filter?: z.infer<typeof projectDocumentFilterZod>;
  actor?: UserClaims;
};
export type ProjectDocumentQueryOptions = {
  actor?: UserClaims;
  options?: {
    filter?: z.infer<typeof projectDocumentFilterZod>;
    sort?: z.infer<typeof projectDocumentSortZod>;
    pagination?: PaginationQuery;
  };
};

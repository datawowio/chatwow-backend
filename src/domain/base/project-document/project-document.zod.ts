import z from 'zod';

import type { PaginationQuery } from '@shared/common/common.pagintaion';
import { parmUuidsZod } from '@shared/common/common.zod';
import { getSortZod } from '@shared/zod/zod.util';

import { PROJECT_DOCUMENT_STATUS } from './project-document.constant';

export type ProjectDocumentSortKey = 'id';

export const projectDocumentFilterZod = z.object({
  documentStatus: z.enum(PROJECT_DOCUMENT_STATUS).optional(),
  projectName: z.string().optional(),
  search: z.string().optional(),
  projectIds: parmUuidsZod.optional(),
});
export const projectDocumentSortZod = getSortZod([
  'id',
  'documentStatus',
  'createdAt',
]);

export type ProjectDocumentQueryOptions = {
  filter?: z.infer<typeof projectDocumentFilterZod>;
  sort?: z.infer<typeof projectDocumentSortZod>;
  pagination?: PaginationQuery;
};

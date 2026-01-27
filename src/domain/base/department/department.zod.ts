import z from 'zod';

import type { PaginationQuery } from '@shared/common/common.pagination';
import { parmUuidsZod } from '@shared/common/common.zod';
import { getSortZod } from '@shared/zod/zod.util';

export const departmentFilterZod = z.object({
  departmentName: z.string().optional(),
  ids: parmUuidsZod.optional(),
  search: z.string().optional(),
});

export const departmentSortZod = getSortZod([
  'id',
  'departmentName',
  'createdAt',
  'updatedAt',
]);

export type DepartmentQueryOptions = {
  filter?: z.infer<typeof departmentFilterZod>;
  sort?: z.infer<typeof departmentSortZod>;
  pagination?: PaginationQuery;
};
export type DepartmentCountQueryOptions = Pick<
  DepartmentQueryOptions,
  'filter'
>;

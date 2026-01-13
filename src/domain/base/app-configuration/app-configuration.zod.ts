import z from 'zod';

import { UserClaims } from '@infra/middleware/jwt/jwt.common';

import type { PaginationQuery } from '@shared/common/common.pagination';
import { getSortZod } from '@shared/zod/zod.util';

export const appConfigurationFilterZod = z
  .object({
    configKey: z.string().optional(),
  })
  .optional();

export const appConfigurationSortZod = getSortZod([
  'id',
  'createdAt',
  'updatedAt',
  'configKey',
]);

export type AppConfigurationFilterOptions = {
  filter?: z.infer<typeof appConfigurationFilterZod>;
  actor?: UserClaims;
};
export type AppConfigurationQueryOptions = {
  actor?: UserClaims;
  options?: {
    filter?: z.infer<typeof appConfigurationFilterZod>;
    sort?: z.infer<typeof appConfigurationSortZod>;
    pagination?: PaginationQuery;
  };
};

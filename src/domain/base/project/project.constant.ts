import type { ProjectStatus } from '@infra/db/db';

import type { UnionArray } from '@shared/common/common.type';

export const PROJECT_STATUS: UnionArray<ProjectStatus> = [
  'ACTIVE',
  'INACTIVE',
  'PROCESSING',
];

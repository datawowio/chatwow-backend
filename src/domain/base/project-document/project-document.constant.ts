import type { DocumentStatus } from '@infra/db/db';

import type { UnionArray } from '@shared/common/common.type';

export const PROJECT_DOCUMENT_STATUS: UnionArray<DocumentStatus> = [
  'ACTIVE',
  'INACTIVE',
  'PROCESSING',
];

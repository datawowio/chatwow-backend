import { SessionStatus } from '@infra/db/db';

import { UnionArray } from '@shared/common/common.type';

export const SESSION_STATUS: UnionArray<SessionStatus> = [
  'ACTIVE',
  'DEPRECATED',
] as const;

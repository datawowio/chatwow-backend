import type { UnionToTuple } from 'type-fest';

import type { MessageStatus } from '@infra/db/db';

export const MessageStatusTuple: UnionToTuple<MessageStatus> = [
  'DEAD',
  'FAIL',
  'INVALID_PAYLOAD',
  'SUCCESS',
] as const;

import { AiModelName } from '@domain/base/ai-model/ai-model.type';

import type { UnionArray } from '@shared/common/common.type';

export const AI_MODEL_NAME: UnionArray<AiModelName> = [
  'gpt-4.1',
  'gpt-4o-mini',
  'gpt-4.1-mini',
  'claude-haiku-4-5',
];

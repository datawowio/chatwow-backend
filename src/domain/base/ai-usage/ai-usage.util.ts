import Big from 'big.js';
import { match } from 'ts-pattern';

import type { EB } from '@infra/db/db.common';

import { newBig } from '@shared/common/common.func';

import { AiUsage } from './ai-usage.domain';

export function aiUsagesTableFilter(eb: EB<'ai_usages'>) {
  return eb.and([eb('ai_usages.ai_reply_at', 'is not', null)]);
}

export function calcTokenPrice(aiUsage: AiUsage) {
  return match(aiUsage.aiModelName)
    .returnType<Big>()
    .with('GPT_DW', () => newBig(aiUsage.tokenUsed * 10))
    .exhaustive();
}

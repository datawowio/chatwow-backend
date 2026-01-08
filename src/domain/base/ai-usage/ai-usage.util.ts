import type { EB } from '@infra/db/db.common';

export function aiUsagesTableFilter(eb: EB<'ai_usages'>) {
  return eb.and([eb('ai_usages.ai_reply_at', 'is not', null)]);
}

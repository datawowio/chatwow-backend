import type { EB } from '@infra/db/db.common';

export function aiUsageTokensTableFilter(eb: EB<'ai_usage_tokens'>) {
  // no base filter
  return eb.and([]);
}

import type { EB } from '@infra/db/db.common';

export function aiUsagesTableFilter(eb: EB<'ai_usages'>) {
  // no base filter
  return eb.and([]);
}

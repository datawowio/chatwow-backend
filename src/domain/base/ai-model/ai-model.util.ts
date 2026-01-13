import type { EB } from '@infra/db/db.common';

export function aiModelsTableFilter(eb: EB<'ai_models'>) {
  // no base filter
  return eb.and([]);
}

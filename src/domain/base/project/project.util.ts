import type { EB } from '@infra/db/db.common';

export function projectsTableFilter(eb: EB<'projects'>) {
  // no base filter
  return eb.and([]);
}

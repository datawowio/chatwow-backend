import type { EB } from '@infra/db/db.common';

export function departmentsTableFilter(eb: EB<'departments'>) {
  // no base filter
  return eb.and([]);
}

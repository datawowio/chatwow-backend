import type { EB } from '@infra/db/db.common';

export function usersTableFilter(eb: EB<'users'>) {
  // no base filter
  return eb.and([]);
}

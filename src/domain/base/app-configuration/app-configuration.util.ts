import type { EB } from '@infra/db/db.common';

export function appConfigurationsTableFilter(eb: EB<'app_configurations'>) {
  // no base filter
  return eb.and([]);
}

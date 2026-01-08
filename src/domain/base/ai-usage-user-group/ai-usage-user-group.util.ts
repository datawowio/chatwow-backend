import type { EB } from '@infra/db/db.common';

export function aiUsageUserGroupsTableFilter(eb: EB<'ai_usage_user_groups'>) {
  // no base filter
  return eb.and([]);
}

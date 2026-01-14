import type { EB } from '@infra/db/db.common';

export function projectChatSessionsTableFilter(
  eb: EB<'project_chat_sessions'>,
) {
  // no base filter
  return eb.and([]);
}

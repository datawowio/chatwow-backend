import type { EB } from '@infra/db/db.common';

export function projectChatLogsTableFilter(eb: EB<'project_chat_logs'>) {
  // no base filter
  return eb.and([]);
}

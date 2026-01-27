import type { EB } from '@infra/db/db.common';

export function projectChatBookmarksTableFilter(
  eb: EB<'project_chat_bookmarks'>,
) {
  // no base filter
  return eb.and([]);
}

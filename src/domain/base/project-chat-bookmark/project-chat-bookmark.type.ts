import type { ProjectChatBookmarks } from '@infra/db/db';
import type { DBModel } from '@infra/db/db.common';

import type {
  Plain,
  Serialized,
  WithPgState,
} from '@shared/common/common.type';

import type { ProjectChatBookmark } from './project-chat-bookmark.domain';

export type ProjectChatBookmarkPg = DBModel<ProjectChatBookmarks>;
export type ProjectChatBookmarkPlain = Plain<ProjectChatBookmark>;

export type ProjectChatBookmarkJson = Serialized<ProjectChatBookmarkPlain>;
export type ProjectChatBookmarkJsonState = WithPgState<
  ProjectChatBookmarkJson,
  ProjectChatBookmarkPg
>;

export type ProjectChatBookmarkNewData = {
  actorId: string;
  data: {
    bookmarkText: string;
    projectId: string;
  };
};

export type ProjectChatBookmarkUpdateData = {
  data: {
    bookmarkText?: string;
  };
};

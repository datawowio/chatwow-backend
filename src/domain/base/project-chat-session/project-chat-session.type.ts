import type { ProjectChatSessions } from '@infra/db/db';
import type { DBModel } from '@infra/db/db.common';

import type {
  Plain,
  Serialized,
  WithPgState,
} from '@shared/common/common.type';

import type { ProjectChatSession } from './project-chat-session.domain';

export type ProjectChatSessionPg = DBModel<ProjectChatSessions>;
export type ProjectChatSessionPlain = Plain<ProjectChatSession>;
export type ProjectChatSessionJson = Serialized<ProjectChatSessionPlain>;
export type ProjectChatSessionJsonState = WithPgState<
  ProjectChatSessionJson,
  ProjectChatSessionPg
>;

export type ProjectChatSessionNewData = {
  userId: string;
  projectId: string;
  initChatLogId?: string;
  latestChatLogId?: string;
};

export type ProjectChatSessionUpdateData = {
  latestChatLogId?: string;
  initChatLogId?: string;
};

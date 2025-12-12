import type { ChatSender, ProjectChatLogs } from '@infra/db/db';
import type { DBModel } from '@infra/db/db.common';

import type {
  Plain,
  Serialized,
  WithPgState,
} from '@shared/common/common.type';

import type { ProjectChatLog } from './project-chat-log.domain';

export type ProjectChatLogPg = DBModel<ProjectChatLogs>;
export type ProjectChatLogPlain = Plain<ProjectChatLog>;
export type ProjectChatLogJson = Serialized<ProjectChatLogPlain>;
export type ProjectChatLogJsonState = WithPgState<
  ProjectChatLogJson,
  ProjectChatLogPg
>;

export type ProjectChatLogNewData = {
  projectChatSessionId: string;
  chatSender: ChatSender;
  message: string;
  parentId?: string | null;
};

export type ProjectChatLogUpdateData = {
  message?: string;
  parentId?: string | null;
};

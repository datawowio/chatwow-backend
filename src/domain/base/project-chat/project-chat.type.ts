import type { ChatSender, ProjectChats } from '@infra/db/db';
import type { DBModel } from '@infra/db/db.common';

import type { Plain, Serialized } from '@shared/common/common.type';

import type { ProjectChat } from './project-chat.domain';

export type ProjectChatPg = DBModel<ProjectChats>;
export type ProjectChatPlain = Plain<ProjectChat>;

export type ProjectChatJson = Serialized<ProjectChatPlain>;

export type ProjectChatNewData = {
  message: string;
  projectId: string;
  userId: string;
  chatSender: ChatSender;
  parentId?: string;
};

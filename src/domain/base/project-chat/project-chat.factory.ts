import { uuidV7 } from '@shared/common/common.crypto';
import myDayjs from '@shared/common/common.dayjs';
import { isDefined } from '@shared/common/common.validator';

import { projectChatFromPlain } from './project-chat.mapper';
import type { ProjectChatNewData } from './project-chat.type';

export function newProjectChat(data: ProjectChatNewData) {
  return projectChatFromPlain({
    id: uuidV7(),
    createdAt: myDayjs().toDate(),
    chatSender: data.chatSender,
    projectId: data.projectId,
    message: data.message,
    userId: data.userId,
    parentId: isDefined(data.parentId) ? data.parentId : null,
  });
}

export function newProjectChats(data: ProjectChatNewData[]) {
  return data.map((d) => newProjectChat(d));
}

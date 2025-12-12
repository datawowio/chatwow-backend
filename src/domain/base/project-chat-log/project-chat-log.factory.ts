import { uuidV7 } from '@shared/common/common.crypto';
import myDayjs from '@shared/common/common.dayjs';
import { isDefined } from '@shared/common/common.validator';

import { projectChatLogFromPlain } from './project-chat-log.mapper';
import type { ProjectChatLogNewData } from './project-chat-log.type';

export function newProjectChatLog(data: ProjectChatLogNewData) {
  return projectChatLogFromPlain({
    id: uuidV7(),
    createdAt: myDayjs().toDate(),
    projectChatSessionId: data.projectChatSessionId,
    chatSender: data.chatSender,
    message: data.message,
    parentId: isDefined(data.parentId) ? data.parentId : null,
  });
}

export function newProjectChatLogs(data: ProjectChatLogNewData[]) {
  return data.map((d) => newProjectChatLog(d));
}

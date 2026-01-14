import { uuidV7 } from '@shared/common/common.crypto';
import myDayjs from '@shared/common/common.dayjs';
import { valueOr } from '@shared/common/common.func';

import { projectChatSessionFromPlain } from './project-chat-session.mapper';
import type { ProjectChatSessionNewData } from './project-chat-session.type';

export function newProjectChatSession(data: ProjectChatSessionNewData) {
  return projectChatSessionFromPlain({
    id: uuidV7(),
    createdAt: myDayjs().toDate(),
    userId: data.userId,
    projectId: data.projectId,
    latestChatLogId: valueOr(data.latestChatLogId, null),
    initChatLogId: valueOr(data.initChatLogId, null),
  });
}

export function newProjectChatSessions(data: ProjectChatSessionNewData[]) {
  return data.map((d) => newProjectChatSession(d));
}

import { uuidV7 } from '@shared/common/common.crypto';
import myDayjs from '@shared/common/common.dayjs';
import { isDefined } from '@shared/common/common.validator';

import { LineSession } from './line-session.domain';
import { lineSessionFromPlain } from './line-session.mapper';
import type { LineSessionNewData } from './line-session.type';

export function newLineSession(data: LineSessionNewData): LineSession {
  return lineSessionFromPlain({
    id: uuidV7(),
    createdAt: myDayjs().toDate(),
    updatedAt: myDayjs().toDate(),
    projectId: data.projectId,
    lineBotId: data.lineBotId,
    latestChatLogId: isDefined(data.latestChatLogId)
      ? data.latestChatLogId
      : null,
    lineAccountId: data.lineAccountId,
    lineSessionStatus: isDefined(data.lineSessionStatus)
      ? data.lineSessionStatus
      : 'ACTIVE',
  });
}

export function newLineSessions(data: LineSessionNewData[]): LineSession[] {
  return data.map((d) => newLineSession(d));
}

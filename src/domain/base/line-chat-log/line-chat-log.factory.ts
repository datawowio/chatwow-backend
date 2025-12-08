import { uuidV7 } from '@shared/common/common.crypto';
import myDayjs from '@shared/common/common.dayjs';
import { isDefined } from '@shared/common/common.validator';

import { LineChatLog } from './line-chat-log.domain';
import { lineChatLogFromPlain } from './line-chat-log.mapper';
import type { LineChatLogNewData } from './line-chat-log.type';

export function newLineChatLog(data: LineChatLogNewData): LineChatLog {
  return lineChatLogFromPlain({
    id: uuidV7(),
    createdAt: myDayjs().toDate(),
    chatSender: data.chatSender,
    lineSessionId: data.lineSessionId || null,
    lineAccountId: data.lineAccountId,
    message: data.message,
    parentId: isDefined(data.parentId) ? data.parentId : null,
  });
}

export function newLineChatLogs(data: LineChatLogNewData[]): LineChatLog[] {
  return data.map((d) => newLineChatLog(d));
}

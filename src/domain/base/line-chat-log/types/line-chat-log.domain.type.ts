import type { ChatSender, LineChatLogs } from '@infra/db/db';
import type { DBModel } from '@infra/db/db.common';

import type { Plain, Serialized } from '@shared/common/common.type';

import type { LineChatLog } from '../line-chat-log.domain';

export type LineChatLogPg = DBModel<LineChatLogs>;
export type LineChatLogPlain = Plain<LineChatLog>;

export type LineChatLogJson = Serialized<LineChatLogPlain>;

export type LineChatLogNewData = {
  message: string;
  lineSessionId: string;
  chatSender: ChatSender;
  parentId?: string;
};

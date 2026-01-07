import type { ChatSender, LineChatLogs } from '@infra/db/db';
import type { DBModel } from '@infra/db/db.common';

import type {
  Plain,
  Serialized,
  WithPgState,
} from '@shared/common/common.type';

import { LineChatLog } from './line-chat-log.domain';

export type LineChatLogPg = DBModel<LineChatLogs>;
export type LineChatLogPlain = Plain<LineChatLog>;

export type LineChatLogJson = Serialized<LineChatLogPlain>;
export type LineChatLogJsonWithState = WithPgState<
  LineChatLogJson,
  LineChatLogPg
>;

export type LineChatLogNewData = {
  message: string;
  chatSender: ChatSender;
  lineSessionId?: string;
  lineAccountId: string;
  parentId?: string;
};

export type LineChatLogUpdateData = {
  lineSessionId?: string;
  message?: string;
};

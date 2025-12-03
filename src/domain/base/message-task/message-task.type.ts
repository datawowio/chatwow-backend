import type { MessageStatus, MessageTasks } from '@infra/db/db';
import type { DBModel } from '@infra/db/db.common';

import type { PaginationQuery } from '@shared/common/common.pagination';
import type {
  ParsedSort,
  Plain,
  Serialized,
  WithPgState,
} from '@shared/common/common.type';

import type { MessageTask } from './message-task.domain';

export type MessageTaskPg = DBModel<MessageTasks>;
export type MessageTaskPlain = Plain<MessageTask>;
export type MessageTaskJson = Serialized<MessageTaskPlain>;
export type MessageTaskJsonState = WithPgState<MessageTaskJson, MessageTaskPg>;

export type MessageTaskNewData = {
  id: string;
  queueName: string;
  exchangeName: string;
  payload: Record<string, any>;
  maxAttempts?: number;
  messageStatus?: MessageStatus;
};

export type MessageTaskUpdateData = {
  messageStatus?: MessageStatus;
  attempts?: number;
  lastError?: string | null;
};

export type MessageTaskSortKey = 'id' | 'createdAt' | 'updatedAt';

export type MessageTaskQueryOptions = {
  filter?: {
    queueName?: string;
    exchangeName?: string;
    messageStatus?: MessageStatus;
  };
  sort?: ParsedSort<MessageTaskSortKey>;
  pagination?: PaginationQuery;
};

export type ProcessMessageOpts = {
  queueName: string;
  exchangeName: string;
  payload: Record<string, any>;
};

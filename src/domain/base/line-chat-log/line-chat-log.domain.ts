import type { ChatSender } from '@infra/db/db';

import { DomainEntity } from '@shared/common/common.domain';
import { valueOr } from '@shared/common/common.func';

import type {
  LineChatLogPg,
  LineChatLogPlain,
  LineChatLogUpdateData,
} from './line-chat-log.type';

export class LineChatLog extends DomainEntity<LineChatLogPg> {
  readonly id: string;
  readonly createdAt: Date;
  readonly chatSender: ChatSender;
  readonly message: string;
  readonly lineSessionId: string | null;
  readonly lineAccountId: string;
  readonly parentId: string | null;

  constructor(plain: LineChatLogPlain) {
    super();
    Object.assign(this, plain);
  }

  edit(data: LineChatLogUpdateData) {
    const plain: LineChatLogPlain = {
      id: this.id,
      createdAt: this.createdAt,
      chatSender: this.chatSender,
      message: valueOr(data.message, this.message),
      lineAccountId: this.lineAccountId,
      parentId: this.parentId,

      lineSessionId: valueOr(data.lineSessionId, this.lineSessionId),
    };

    Object.assign(this, plain);
  }
}

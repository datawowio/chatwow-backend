import type { ChatSender } from '@infra/db/db';

import { DomainEntity } from '@shared/common/common.domain';

import type { LineChatLogPg, LineChatLogPlain } from './line-chat-log.type';

export class LineChatLog extends DomainEntity<LineChatLogPg> {
  readonly id: string;
  readonly createdAt: Date;
  readonly chatSender: ChatSender;
  readonly message: string;
  readonly lineSessionId: string;
  readonly parentId: string | null;

  constructor(plain: LineChatLogPlain) {
    super();
    Object.assign(this, plain);
  }
}

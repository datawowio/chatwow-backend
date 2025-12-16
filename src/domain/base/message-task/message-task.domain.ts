import type { MessageStatus } from '@infra/db/db';

import myDayjs from '@shared/common/common.dayjs';
import { DomainEntity } from '@shared/common/common.domain';
import { valueOr } from '@shared/common/common.func';

import type {
  MessageTaskPg,
  MessageTaskPlain,
  MessageTaskUpdateData,
} from './message-task.type';

export class MessageTask extends DomainEntity<MessageTaskPg> {
  readonly id: string;
  readonly queueName: string;
  readonly exchangeName: string;
  readonly payload: Record<string, any>;
  readonly messageStatus: MessageStatus;
  readonly attempts: number;
  readonly maxAttempts: number;
  readonly lastError: string | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly expireAt: Date;

  constructor(plain: MessageTaskPlain) {
    super();
    Object.assign(this, plain);
  }

  private _edit(data: MessageTaskUpdateData) {
    const plain: MessageTaskPlain = {
      id: this.id,
      queueName: this.queueName,
      exchangeName: this.exchangeName,
      payload: this.payload,
      maxAttempts: this.maxAttempts,
      createdAt: this.createdAt,
      updatedAt: myDayjs().toDate(),
      expireAt: this.expireAt,

      // update able
      messageStatus: valueOr(data.messageStatus, this.messageStatus),
      attempts: valueOr(data.attempts, this.attempts),
      lastError: valueOr(data.lastError, this.lastError),
    };

    Object.assign(this, plain);
  }

  startProcess(error?: string) {
    this._edit({
      attempts: this.attempts + 1,
      messageStatus: 'SUCCESS',
      lastError: error || this.lastError,
    });
  }

  markAsFailed(error: string) {
    this._edit({
      messageStatus: 'FAIL',
      lastError: error,
    });
  }

  markAsInvalid(error: string) {
    this._edit({
      messageStatus: 'INVALID_PAYLOAD',
      lastError: error,
    });
  }

  markAsSuccess() {
    this._edit({
      messageStatus: 'SUCCESS',
    });
  }

  markAsDead(error?: string) {
    this._edit({
      messageStatus: 'DEAD',
      lastError: error,
    });
  }

  isMaxAttemptsReached(): boolean {
    return this.attempts >= this.maxAttempts;
  }
}

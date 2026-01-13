import Big from 'big.js';
import { Writable } from 'type-fest';

import { AiModelName, AiUsageAction } from '@infra/db/db';

import myDayjs from '@shared/common/common.dayjs';
import { DomainEntity } from '@shared/common/common.domain';

import { AiUsageRefTable } from './ai-usage.constant';
import type {
  AiUsagePg,
  AiUsagePlain,
  AiUsageStopRecordData,
} from './ai-usage.type';
import { calcTokenPrice } from './ai-usage.util';

export class AiUsage extends DomainEntity<AiUsagePg> {
  readonly id: string;
  readonly createdById: string | null;
  readonly aiModelName: AiModelName;
  readonly projectId: string;
  readonly createdAt: Date;
  readonly aiRequestAt: Date;
  readonly aiReplyAt: Date | null;
  readonly tokenUsed: number;
  readonly tokenPrice: Big;
  readonly tokenInfo: object;
  readonly confidence: number;
  readonly refTable: AiUsageRefTable;
  readonly aiUsageAction: AiUsageAction;
  readonly refId: string;
  readonly replyTimeMs: number | null;

  constructor(plain: AiUsagePlain) {
    super();
    Object.assign(this, plain);
  }

  record() {
    const writable = this as Writable<typeof this>;
    writable.aiRequestAt = myDayjs().toDate();

    return this;
  }

  stopRecord(data: AiUsageStopRecordData) {
    if (!this.aiRequestAt) {
      throw new Error('unexpected no request at to stop record');
    }

    const writable = this as Writable<typeof this>;
    writable.aiReplyAt = myDayjs().toDate();
    writable.tokenUsed = data.tokenUsed;
    writable.confidence = data.confidence;
    writable.replyTimeMs = myDayjs(writable.aiReplyAt).diff(
      writable.aiRequestAt,
      'milliseconds',
    );
    writable.tokenPrice = calcTokenPrice(this);

    return this;
  }

  stopRecordError() {
    const writable = this as Writable<typeof this>;
    writable.aiReplyAt = null;
    writable.confidence = -1;
    writable.replyTimeMs = myDayjs(writable.aiReplyAt).diff(
      writable.aiRequestAt,
      'milliseconds',
    );

    return this;
  }
}

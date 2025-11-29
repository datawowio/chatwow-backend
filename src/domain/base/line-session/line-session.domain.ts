import { LineSessionStatus } from '@infra/db/db';

import myDayjs from '@shared/common/common.dayjs';
import { DomainEntity } from '@shared/common/common.domain';
import { isDefined } from '@shared/common/common.validator';

import { lineSessionFromPlain } from './line-session.mapper';
import type {
  LineSessionPg,
  LineSessionPlain,
  LineSessionUpdateData,
} from './line-session.type';

export class LineSession extends DomainEntity<LineSessionPg> {
  readonly id: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly lineAccountId: string;
  readonly projectId: string;
  readonly lineSessionStatus: LineSessionStatus;
  readonly lineBotId: string;
  readonly latestChatLogId: string | null;

  constructor(plain: LineSessionPlain) {
    super();
    Object.assign(this, plain);
  }

  edit(data: LineSessionUpdateData) {
    const plain: LineSessionPlain = {
      id: this.id,
      createdAt: this.createdAt,
      lineAccountId: this.lineAccountId,
      updatedAt: myDayjs().toDate(),
      lineBotId: this.lineBotId,
      projectId: this.projectId,

      lineSessionStatus: isDefined(data.lineSessionStatus)
        ? data.lineSessionStatus
        : this.lineSessionStatus,
      latestChatLogId: isDefined(data.latestChatLogId)
        ? data.latestChatLogId
        : this.latestChatLogId,
    };

    return lineSessionFromPlain(plain);
  }
}

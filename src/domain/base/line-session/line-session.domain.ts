import { uuidV7 } from '@shared/common/common.crypto';
import myDayjs from '@shared/common/common.dayjs';
import { DomainEntity } from '@shared/common/common.domain';
import { isDefined } from '@shared/common/common.validator';

import { LineSessionMapper } from './line-session.mapper';
import type {
  LineSessionNewData,
  LineSessionPg,
  LineSessionPlain,
  LineSessionUpdateData,
} from './types/line-session.domain.type';

export class LineSession extends DomainEntity<LineSessionPg> {
  readonly id: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly lineAccountId: string;
  readonly projectId: string;
  readonly latestChatLogId: string | null;

  constructor(plain: LineSessionPlain) {
    super();
    Object.assign(this, plain);
  }

  static new(data: LineSessionNewData): LineSession {
    return LineSessionMapper.fromPlain({
      id: uuidV7(),
      createdAt: myDayjs().toDate(),
      updatedAt: myDayjs().toDate(),
      latestChatLogId: isDefined(data.latestChatLogId)
        ? data.latestChatLogId
        : null,
      lineAccountId: data.lineAccountId,
      projectId: data.projectId,
    });
  }

  static newBulk(data: LineSessionNewData[]) {
    return data.map((d) => LineSession.new(d));
  }

  edit(data: LineSessionUpdateData) {
    const plain: LineSessionPlain = {
      id: this.id,
      createdAt: this.createdAt,
      lineAccountId: this.lineAccountId,
      updatedAt: myDayjs().toDate(),
      projectId: this.projectId,

      latestChatLogId: isDefined(data.latestChatLogId)
        ? data.latestChatLogId
        : this.latestChatLogId,
    };

    Object.assign(this, plain);
  }
}

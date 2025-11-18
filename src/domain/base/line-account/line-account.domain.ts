import { uuidV7 } from '@shared/common/common.crypto';
import myDayjs from '@shared/common/common.dayjs';
import { DomainEntity } from '@shared/common/common.domain';
import { isDefined } from '@shared/common/common.validator';

import { LineAccountMapper } from './line-account.mapper';
import type {
  LineAccountNewData,
  LineAccountPg,
  LineAccountPlain,
  LineAccountUpdateData,
} from './types/line-account.domain.type';

export class LineAccount extends DomainEntity<LineAccountPg> {
  readonly id: string;
  readonly createdAt: Date;
  readonly activeLineSessionId: string | null;

  constructor(plain: LineAccountPlain) {
    super();
    Object.assign(this, plain);
  }

  static new(data: LineAccountNewData): LineAccount {
    return LineAccountMapper.fromPlain({
      id: uuidV7(),
      createdAt: myDayjs().toDate(),
      activeLineSessionId: isDefined(data.activeLineSessionId)
        ? data.activeLineSessionId
        : null,
    });
  }

  edit(data: LineAccountUpdateData) {
    const plain: LineAccountPlain = {
      id: this.id,
      createdAt: this.createdAt,

      activeLineSessionId: isDefined(data.activeLineSessionId)
        ? data.activeLineSessionId
        : null,
    };

    Object.assign(this, plain);
  }
}

import myDayjs from '@shared/common/common.dayjs';
import { DomainEntity } from '@shared/common/common.domain';
import { isDefined } from '@shared/common/common.validator';

import type {
  LineBotPg,
  LineBotPlain,
  LineBotUpdateData,
} from './line-bot.type';

export class LineBot extends DomainEntity<LineBotPg> {
  readonly id: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly channelAccessToken: string;
  readonly channelSecret: string;

  constructor(plain: LineBotPlain) {
    super();
    Object.assign(this, plain);
  }

  edit(data: LineBotUpdateData) {
    const plain: LineBotPlain = {
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: myDayjs().toDate(),

      //
      channelAccessToken: isDefined(data.channelAccessToken)
        ? data.channelAccessToken
        : this.channelAccessToken,
      channelSecret: isDefined(data.channelSecret)
        ? data.channelSecret
        : this.channelSecret,
    };

    Object.assign(this, plain);
  }
}

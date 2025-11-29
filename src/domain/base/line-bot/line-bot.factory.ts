import { uuidV7 } from '@shared/common/common.crypto';
import myDayjs from '@shared/common/common.dayjs';
import { isDefined } from '@shared/common/common.validator';

import type { LineBot } from './line-bot.domain';
import { lineBotFromPlain } from './line-bot.mapper';
import type { LineBotNewData, LineBotPlain } from './line-bot.type';

export function newLineBot(data: LineBotNewData): LineBot {
  const now = myDayjs().toDate();
  return lineBotFromPlain({
    id: uuidV7(),
    createdAt: now,
    updatedAt: now,
    channelAccessToken: data.channelAccessToken,
    channelSecret: data.channelSecret,
  });
}

export function newLineBots(data: LineBotNewData[]) {
  return data.map((d) => newLineBot(d));
}

export function mockLineBot(data: Partial<LineBotPlain> = {}): LineBot {
  const now = myDayjs().toDate();
  return lineBotFromPlain({
    id: isDefined(data.id) ? data.id : uuidV7(),
    createdAt: isDefined(data.createdAt) ? data.createdAt : now,
    updatedAt: isDefined(data.updatedAt) ? data.updatedAt : now,
    channelAccessToken: isDefined(data.channelAccessToken)
      ? data.channelAccessToken
      : 'mock_channel_access_token',
    channelSecret: isDefined(data.channelSecret)
      ? data.channelSecret
      : 'mock_channel_secret',
  });
}

export function mockLineBots(amount: number, data: Partial<LineBotPlain> = {}) {
  return Array(amount)
    .fill(0)
    .map(() => mockLineBot(data));
}

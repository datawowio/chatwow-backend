import type { LineBots } from '@infra/db/db';
import type { DBModel } from '@infra/db/db.common';

import type {
  Plain,
  Serialized,
  WithPgState,
} from '@shared/common/common.type';

import type { LineBot } from './line-bot.domain';

export type LineBotPg = DBModel<LineBots>;
export type LineBotPlain = Plain<LineBot>;
export type LineBotJson = Serialized<LineBotPlain>;
export type LineBotJsonState = WithPgState<LineBotJson, LineBotPg>;

export type LineBotNewData = {
  channelAccessToken: string;
  channelSecret: string;
};

export type LineBotUpdateData = {
  channelAccessToken?: string;
  channelSecret?: string;
};

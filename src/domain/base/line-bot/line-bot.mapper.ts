import { toDate, toISO } from '@shared/common/common.transformer';

import { LineBot } from './line-bot.domain';
import type { LineBotResponse } from './line-bot.response';
import type {
  LineBotJson,
  LineBotJsonState,
  LineBotPg,
  LineBotPlain,
} from './line-bot.type';

export function lineBotFromPg(pg: LineBotPg): LineBot {
  const plain: LineBotPlain = {
    id: pg.id,
    createdAt: toDate(pg.created_at),
    updatedAt: toDate(pg.updated_at),
    channelAccessToken: pg.channel_access_token,
    channelSecret: pg.channel_secret,
  };
  return new LineBot(plain);
}

export function lineBotFromPgWithState(pg: LineBotPg): LineBot {
  return lineBotFromPg(pg).setPgState(lineBotToPg);
}

export function lineBotFromPlain(plain: LineBotPlain): LineBot {
  return new LineBot({
    id: plain.id,
    createdAt: plain.createdAt,
    updatedAt: plain.updatedAt,
    channelAccessToken: plain.channelAccessToken,
    channelSecret: plain.channelSecret,
  });
}

export function lineBotFromJson(json: LineBotJson): LineBot {
  const plain: LineBotPlain = {
    id: json.id,
    createdAt: toDate(json.createdAt),
    updatedAt: toDate(json.updatedAt),
    channelAccessToken: json.channelAccessToken,
    channelSecret: json.channelSecret,
  };

  return new LineBot(plain);
}

export function lineBotFromJsonWithState(data: LineBotJsonState): LineBot {
  const lineBot = lineBotFromJson(data.data);
  lineBot.setPgState(data.state);
  return lineBot;
}

export function lineBotToPg(lineBot: LineBot): LineBotPg {
  return {
    id: lineBot.id,
    created_at: toISO(lineBot.createdAt),
    updated_at: toISO(lineBot.updatedAt),
    channel_access_token: lineBot.channelAccessToken,
    channel_secret: lineBot.channelSecret,
  };
}

export function lineBotToPlain(lineBot: LineBot): LineBotPlain {
  return {
    id: lineBot.id,
    createdAt: lineBot.createdAt,
    updatedAt: lineBot.updatedAt,
    channelAccessToken: lineBot.channelAccessToken,
    channelSecret: lineBot.channelSecret,
  };
}

export function lineBotToResponse(lineBot: LineBot): LineBotResponse {
  return {
    id: lineBot.id,
    createdAt: toISO(lineBot.createdAt),
    updatedAt: toISO(lineBot.updatedAt),
  };
}

export function lineBotToJson(lineBot: LineBot): LineBotJson {
  return {
    id: lineBot.id,
    createdAt: toISO(lineBot.createdAt),
    updatedAt: toISO(lineBot.updatedAt),
    channelAccessToken: lineBot.channelAccessToken,
    channelSecret: lineBot.channelSecret,
  };
}

export function lineBotToJsonWithState(lineBot: LineBot): LineBotJsonState {
  return {
    data: lineBotToJson(lineBot),
    state: lineBot.pgState,
  };
}

export function lineBotPgToResponse(pg: LineBotPg): LineBotResponse {
  return {
    id: pg.id,
    createdAt: toISO(pg.created_at),
    updatedAt: toISO(pg.updated_at),
  };
}

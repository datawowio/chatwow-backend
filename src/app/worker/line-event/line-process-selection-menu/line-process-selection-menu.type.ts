import { LineBot } from '@domain/base/line-bot/line-bot.domain';
import { LineBotJsonState } from '@domain/base/line-bot/line-bot.type';

import { JobInput } from '@app/worker/worker.type';

export type LineProcessSelectionMenuJobData = {
  lineBot: LineBot;
  lineAccountId: string;
  message: string;
  replyToken: string;
};
export type LineProcessSelectionMenuJobInput = JobInput<{
  lineBot: LineBotJsonState;
  lineAccountId: string;
  message: string;
  replyToken: string;
}>;

export type GetSessionOpts = {
  projectId: string;
  lineBotId: string;
  lineAccountId: string;
};

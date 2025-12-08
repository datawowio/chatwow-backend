import { LineBot } from '@domain/base/line-bot/line-bot.domain';
import { LineBotJsonState } from '@domain/base/line-bot/line-bot.type';

import { JobInput } from '@app/worker/worker.type';

export type LineShowSelectionMenuJobData = {
  lineBot: LineBot;
  lineAccountId: string;
  replyToken: string;
  addMessages?: string[];
};
export type LineShowSelectionMenuJobInput = JobInput<{
  lineBot: LineBotJsonState;
  lineAccountId: string;
  replyToken: string;
  addMessages?: string[];
}>;

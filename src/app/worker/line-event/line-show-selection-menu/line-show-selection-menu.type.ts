import { LineBot } from '@domain/base/line-bot/line-bot.domain';
import { LineBotJsonState } from '@domain/base/line-bot/types/line-bot.domain.type';

export type LineShowSelectionMenuJobData = {
  lineBot: LineBot;
  lineAccountId: string;
  replyToken: string;
  addMessages?: string[];
};
export type LineShowSelectionMenuJobInput = {
  lineBot: LineBotJsonState;
  lineAccountId: string;
  replyToken: string;
  addMessages?: string[];
};

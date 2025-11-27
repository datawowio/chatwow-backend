import { LineBot } from '@domain/base/line-bot/line-bot.domain';
import { LineBotJsonState } from '@domain/base/line-bot/types/line-bot.domain.type';

export type LineProcessVerificationJobData = {
  lineBot: LineBot;
  lineAccountId: string;
  replyToken: string;
  verificationCode: string;
};
export type LineProcessVerificationJobInput = {
  lineBot: LineBotJsonState;
  lineAccountId: string;
  replyToken: string;
  verificationCode: string;
};

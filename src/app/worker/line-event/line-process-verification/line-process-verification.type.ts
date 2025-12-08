import { LineBot } from '@domain/base/line-bot/line-bot.domain';
import { LineBotJsonState } from '@domain/base/line-bot/line-bot.type';

import { JobInput } from '@app/worker/worker.type';

export type LineProcessVerificationJobData = {
  lineBot: LineBot;
  lineAccountId: string;
  replyToken: string;
  verificationCode: string;
};
export type LineProcessVerificationJobInput = JobInput<{
  lineBot: LineBotJsonState;
  lineAccountId: string;
  replyToken: string;
  verificationCode: string;
}>;

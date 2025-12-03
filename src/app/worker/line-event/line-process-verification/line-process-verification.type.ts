import { LineBot } from '@domain/base/line-bot/line-bot.domain';
import { LineBotJsonState } from '@domain/base/line-bot/line-bot.type';

import { TaskData } from '@app/worker/worker.type';

export type LineProcessVerificationJobData = {
  lineBot: LineBot;
  lineAccountId: string;
  replyToken: string;
  verificationCode: string;
};
export type LineProcessVerificationJobInput = TaskData<{
  lineBot: LineBotJsonState;
  lineAccountId: string;
  replyToken: string;
  verificationCode: string;
}>;

import { LineBot } from '@domain/base/line-bot/line-bot.domain';
import { LineBotJsonState } from '@domain/base/line-bot/line-bot.type';
import { LineChatLog } from '@domain/base/line-chat-log/line-chat-log.domain';
import { LineChatLogJsonWithState } from '@domain/base/line-chat-log/line-chat-log.type';

import { JobInput } from '@app/worker/worker.type';

export type LineProcessVerificationJobData = {
  lineBot: LineBot;
  lineChatLogs: LineChatLog[];
  lineAccountId: string;
  replyToken: string;
  verificationCode: string;
};
export type LineProcessVerificationJobInput = JobInput<{
  lineBot: LineBotJsonState;
  lineChatLogs: LineChatLogJsonWithState[];
  lineAccountId: string;
  replyToken: string;
  verificationCode: string;
}>;

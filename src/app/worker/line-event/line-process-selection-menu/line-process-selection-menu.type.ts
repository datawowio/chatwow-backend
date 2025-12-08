import { LineBot } from '@domain/base/line-bot/line-bot.domain';
import { LineBotJsonState } from '@domain/base/line-bot/line-bot.type';
import { LineChatLog } from '@domain/base/line-chat-log/line-chat-log.domain';
import { LineChatLogJsonWithState } from '@domain/base/line-chat-log/line-chat-log.type';

import { JobInput } from '@app/worker/worker.type';

export type LineProcessSelectionMenuJobData = {
  lineBot: LineBot;
  lineAccountId: string;
  message: string;
  replyToken: string;
  lineChatLogs: LineChatLog[];
};
export type LineProcessSelectionMenuJobInput = JobInput<{
  lineBot: LineBotJsonState;
  lineAccountId: string;
  message: string;
  replyToken: string;
  lineChatLogs: LineChatLogJsonWithState[];
}>;

export type GetSessionOpts = {
  projectId: string;
  lineBotId: string;
  lineAccountId: string;
};

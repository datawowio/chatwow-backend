import { LineBot } from '@domain/base/line-bot/line-bot.domain';
import { LineBotJsonState } from '@domain/base/line-bot/line-bot.type';
import { LineChatLog } from '@domain/base/line-chat-log/line-chat-log.domain';
import { LineChatLogJsonWithState } from '@domain/base/line-chat-log/line-chat-log.type';

import { JobInput } from '@app/worker/worker.type';

export type LineShowSelectionMenuJobData = {
  lineBot: LineBot;
  lineAccountId: string;
  replyToken: string;
  addMessages?: string[];
  lineChatLogs: LineChatLog[];
};
export type LineShowSelectionMenuJobInput = JobInput<{
  lineBot: LineBotJsonState;
  lineAccountId: string;
  replyToken: string;
  addMessages?: string[];
  lineChatLogs: LineChatLogJsonWithState[];
}>;

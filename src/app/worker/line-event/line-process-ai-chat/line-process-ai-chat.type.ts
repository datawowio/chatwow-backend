import { LineBot } from '@domain/base/line-bot/line-bot.domain';
import { LineBotJsonState } from '@domain/base/line-bot/line-bot.type';
import { LineChatLog } from '@domain/base/line-chat-log/line-chat-log.domain';
import { LineChatLogJsonWithState } from '@domain/base/line-chat-log/line-chat-log.type';
import { LineSession } from '@domain/base/line-session/line-session.domain';
import { LineSessionJsonState } from '@domain/base/line-session/line-session.type';

import { JobInput } from '@app/worker/worker.type';

export type LineProcessAiChatJobData = {
  lineBot: LineBot;
  lineSession: LineSession;
  replyToken: string;
  lineChatLogs: LineChatLog[];
  message: string;
};

export type LineProcessAiChatJobInput = JobInput<{
  lineBot: LineBotJsonState;
  lineSession: LineSessionJsonState;
  replyToken: string;
  lineChatLogs: LineChatLogJsonWithState[];
  message: string;
}>;

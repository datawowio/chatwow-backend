import { LineBot } from '@domain/base/line-bot/line-bot.domain';
import { LineBotJsonState } from '@domain/base/line-bot/line-bot.type';
import { LineSession } from '@domain/base/line-session/line-session.domain';
import { LineSessionJsonState } from '@domain/base/line-session/line-session.type';

import { JobInput } from '@app/worker/worker.type';

export type LineProcessAiChatJobData = {
  lineBot: LineBot;
  lineSession: LineSession;
  replyToken: string;
  message: string;
};

export type LineProcessAiChatJobInput = JobInput<{
  lineBot: LineBotJsonState;
  lineSession: LineSessionJsonState;
  replyToken: string;
  message: string;
}>;

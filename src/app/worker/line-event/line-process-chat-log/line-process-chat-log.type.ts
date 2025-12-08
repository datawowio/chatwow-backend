import { LineChatLog } from '@domain/base/line-chat-log/line-chat-log.domain';
import { LineChatLogJsonWithState } from '@domain/base/line-chat-log/line-chat-log.type';

import { JobInput } from '@app/worker/worker.type';

export type LineProcessChatLogJobData = LineChatLog[];

export type LineProcessChatLogJobInput = JobInput<LineChatLogJsonWithState[]>;

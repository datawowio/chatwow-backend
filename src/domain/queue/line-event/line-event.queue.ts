import { lineBotToJsonWithState } from '@domain/base/line-bot/line-bot.mapper';
import { lineChatLogToJsonState } from '@domain/base/line-chat-log/line-chat-log.mapper';
import { lineSessionToJsonWithState } from '@domain/base/line-session/line-session.mapper';
import { Injectable } from '@nestjs/common';

import { BaseAmqpExchange } from '@infra/global/amqp/amqp.abstract';
import { wrapJobMeta } from '@infra/global/amqp/amqp.common';

import {
  LineProcessAiChatJobData,
  LineProcessAiChatJobInput,
} from '@app/worker/line-event/line-process-ai-chat/line-process-ai-chat.type';
import {
  LineProcessChatLogJobData,
  LineProcessChatLogJobInput,
} from '@app/worker/line-event/line-process-chat-log/line-process-chat-log.type';
import {
  LineProcessRawJobData,
  LineProcessRawJobInput,
} from '@app/worker/line-event/line-process-raw/line-process-raw.type';
import {
  LineProcessSelectionMenuJobData,
  LineProcessSelectionMenuJobInput,
} from '@app/worker/line-event/line-process-selection-menu/line-process-selection-menu.type';
import {
  LineProcessVerificationJobData,
  LineProcessVerificationJobInput,
} from '@app/worker/line-event/line-process-verification/line-process-verification.type';
import {
  LineShowSelectionMenuJobData,
  LineShowSelectionMenuJobInput,
} from '@app/worker/line-event/line-show-selection-menu/line-show-selection-menu.type';
import { LINE_EVENT_QUEUES, MQ_EXCHANGE } from '@app/worker/worker.constant';

@Injectable()
export class LineEventQueue extends BaseAmqpExchange {
  config = MQ_EXCHANGE.LINE_EVENT;

  jobProcessRaw(data: LineProcessRawJobData) {
    const input: LineProcessRawJobInput = wrapJobMeta({
      config: data.config,
      data: data.data,
      lineBotId: data.lineBotId,
    });

    this.addJob(LINE_EVENT_QUEUES.PROCESS_RAW.name, input);
  }

  jobProcessVerification(domainData: LineProcessVerificationJobData) {
    const input: LineProcessVerificationJobInput = wrapJobMeta({
      ...domainData,
      lineBot: lineBotToJsonWithState(domainData.lineBot),
      lineChatLogs: domainData.lineChatLogs.map((log) =>
        lineChatLogToJsonState(log),
      ),
    });

    this.addJob(LINE_EVENT_QUEUES.PROCESS_VERIFICATION.name, input);
  }

  jobProcessSelectionMenu(domainData: LineProcessSelectionMenuJobData) {
    const input: LineProcessSelectionMenuJobInput = wrapJobMeta({
      ...domainData,
      lineBot: lineBotToJsonWithState(domainData.lineBot),
      lineChatLogs: domainData.lineChatLogs.map((log) =>
        lineChatLogToJsonState(log),
      ),
    });

    this.addJob(LINE_EVENT_QUEUES.PROCESS_SELECTION_MENU.name, input);
  }

  jobShowSelectionMenu(domainData: LineShowSelectionMenuJobData) {
    const input: LineShowSelectionMenuJobInput = wrapJobMeta({
      ...domainData,
      lineBot: lineBotToJsonWithState(domainData.lineBot),
      lineChatLogs: domainData.lineChatLogs.map((log) =>
        lineChatLogToJsonState(log),
      ),
    });

    this.addJob(LINE_EVENT_QUEUES.SHOW_SELECTION_MENU.name, input);
  }

  jobProcessAiChat(domainData: LineProcessAiChatJobData) {
    const input: LineProcessAiChatJobInput = wrapJobMeta({
      lineBot: lineBotToJsonWithState(domainData.lineBot),
      lineSession: lineSessionToJsonWithState(domainData.lineSession),
      replyToken: domainData.replyToken,
      message: domainData.message,
      lineChatLogs: domainData.lineChatLogs.map((log) =>
        lineChatLogToJsonState(log),
      ),
    });

    this.addJob(LINE_EVENT_QUEUES.PROCESS_AI_CHAT.name, input);
  }

  jobProcessChatLog(domainData: LineProcessChatLogJobData) {
    const input: LineProcessChatLogJobInput = wrapJobMeta(
      domainData.map((item) => lineChatLogToJsonState(item)),
    );

    this.addJob(LINE_EVENT_QUEUES.PROCESS_CHAT_LOG.name, input);
  }
}

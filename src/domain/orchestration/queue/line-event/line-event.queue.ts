import { lineBotToJsonWithState } from '@domain/base/line-bot/line-bot.mapper';
import { lineSessionToJsonWithState } from '@domain/base/line-session/line-session.mapper';
import { Injectable } from '@nestjs/common';

import {
  LineProcessAiChatJobData,
  LineProcessAiChatJobInput,
} from '@app/worker/line-event/line-process-ai-chat/line-process-ai-chat.type';
import { LineProcessRawJobData } from '@app/worker/line-event/line-process-raw/line-process-raw.type';
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
import { LINE_EVENT_JOBS } from '@app/worker/worker.job';
import { QUEUE } from '@app/worker/worker.queue';

import { BaseQueue } from '@shared/task/task.abstract';

@Injectable()
export class LineEventQueue extends BaseQueue {
  queueName = QUEUE.LINE_EVENT;

  jobProcessRaw(data: LineProcessRawJobData) {
    this.addJob(LINE_EVENT_JOBS.PROCESS_RAW, data);
  }

  jobProcessVerification(domainData: LineProcessVerificationJobData) {
    const input: LineProcessVerificationJobInput = {
      ...domainData,
      lineBot: lineBotToJsonWithState(domainData.lineBot),
    };

    this.addJob(LINE_EVENT_JOBS.PROCESS_VERIFICATION, input);
  }

  jobProcessSelectionMenu(domainData: LineProcessSelectionMenuJobData) {
    const input: LineProcessSelectionMenuJobInput = {
      ...domainData,
      lineBot: lineBotToJsonWithState(domainData.lineBot),
    };

    this.addJob(LINE_EVENT_JOBS.PROCESS_SELECTION_MENU, input);
  }

  jobShowSelectionMenu(domainData: LineShowSelectionMenuJobData) {
    const input: LineShowSelectionMenuJobInput = {
      ...domainData,
      lineBot: lineBotToJsonWithState(domainData.lineBot),
    };

    this.addJob(LINE_EVENT_JOBS.SHOW_SELECTION_MENU, input);
  }

  jobProcessAiChat(domainData: LineProcessAiChatJobData) {
    const input: LineProcessAiChatJobInput = {
      lineBotJsonState: lineBotToJsonWithState(domainData.lineBot),
      lineSessionJsonState: lineSessionToJsonWithState(domainData.lineSession),
      data: domainData.data,
    };

    this.addJob(LINE_EVENT_JOBS.PROCESS_AI_CHAT, input);
  }
}

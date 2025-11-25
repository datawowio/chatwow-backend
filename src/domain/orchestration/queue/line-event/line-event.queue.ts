import { Injectable } from '@nestjs/common';

import { LineProcessAiChatJobData } from '@app/worker/line-event/line-process-ai-chat/line-process-ai-chat.type';
import { LineProcessRawJobData } from '@app/worker/line-event/line-process-raw/line-process-raw.type';
import { LineProcessSelectionMenuJobData } from '@app/worker/line-event/line-process-selection-menu/line-process-selection-menu.type';
import { LineProcessVerificationJobData } from '@app/worker/line-event/line-process-verification/line-process-verification.type';
import { LineSendMessageJobData } from '@app/worker/line-event/line-send-message/line-send-message.type';
import { LINE_EVENT_JOBS } from '@app/worker/worker.job';
import { QUEUE } from '@app/worker/worker.queue';

import { BaseQueue } from '@shared/task/task.abstract';

@Injectable()
export class LineEventQueue extends BaseQueue {
  queueName = QUEUE.LINE_EVENT;

  jobProcessRaw(data: LineProcessRawJobData) {
    this.addJob(LINE_EVENT_JOBS.PROCESS_RAW, data);
  }

  jobProcessVerification(data: LineProcessVerificationJobData) {
    this.addJob(LINE_EVENT_JOBS.PROCESS_VERIFICATION, data);
  }

  jobProcessSelectionMenu(data: LineProcessSelectionMenuJobData) {
    this.addJob(LINE_EVENT_JOBS.PROCESS_SELECTION_MENU, data);
  }

  jobProcessAiChat(data: LineProcessAiChatJobData) {
    this.addJob(LINE_EVENT_JOBS.PROCESS_AI_CHAT, data);
  }

  jobSendMessage(data: LineSendMessageJobData) {
    this.addJob(LINE_EVENT_JOBS.SEND_MESSAGE, data);
  }
}

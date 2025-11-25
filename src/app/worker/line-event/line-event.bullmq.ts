import { Injectable } from '@nestjs/common';

import { LINE_EVENT_JOBS } from '@app/worker/worker.job';

import { BaseTaskHandler } from '@shared/task/task.abstract';
import { QueueTask } from '@shared/task/task.decorator';

import { LineProcessAiChatCommand } from './line-process-ai-chat/line-process-ai-chat.command';
import { LineProcessAiChatJobData } from './line-process-ai-chat/line-process-ai-chat.type';
import { LineProcessRawCommand } from './line-process-raw/line-process-raw.command';
import { LineProcessRawJobData } from './line-process-raw/line-process-raw.type';
import { LineProcessSelectionMenuCommand } from './line-process-selection-menu/line-process-selection-menu.command';
import { LineProcessSelectionMenuJobData } from './line-process-selection-menu/line-process-selection-menu.type';
import { LineProcessVerificationCommand } from './line-process-verification/line-process-verification.command';
import { LineProcessVerificationJobData } from './line-process-verification/line-process-verification.type';
import { LineSendMessageCommand } from './line-send-message/line-send-message.command';
import { LineSendMessageJobData } from './line-send-message/line-send-message.type';

@Injectable()
export class LineEventBullmq extends BaseTaskHandler {
  constructor(
    private lineProcessRawCommand: LineProcessRawCommand,
    private lineSendMessageCommand: LineSendMessageCommand,
    private lineProcessVerificationCommand: LineProcessVerificationCommand,
    private lineProcessSelectionMenuCommand: LineProcessSelectionMenuCommand,
    private lineProcessAiChatCommand: LineProcessAiChatCommand,
  ) {
    super();
  }

  @QueueTask(LINE_EVENT_JOBS.PROCESS_RAW)
  async processRaw(data: LineProcessRawJobData) {
    return this.lineProcessRawCommand.exec(data);
  }

  @QueueTask(LINE_EVENT_JOBS.PROCESS_VERIFICATION)
  async processVerification(data: LineProcessVerificationJobData) {
    return this.lineProcessVerificationCommand.exec(data);
  }

  @QueueTask(LINE_EVENT_JOBS.PROCESS_SELECTION_MENU)
  async processSelectionMenu(data: LineProcessSelectionMenuJobData) {
    return this.lineProcessSelectionMenuCommand.exec(data);
  }

  @QueueTask(LINE_EVENT_JOBS.PROCESS_AI_CHAT)
  async processAiChat(data: LineProcessAiChatJobData) {
    return this.lineProcessAiChatCommand.exec(data);
  }

  @QueueTask(LINE_EVENT_JOBS.SEND_MESSAGE)
  async sendMessage(data: LineSendMessageJobData) {
    return this.lineSendMessageCommand.exec(data);
  }
}

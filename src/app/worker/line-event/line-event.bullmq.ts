import { LineBotMapper } from '@domain/base/line-bot/line-bot.mapper';
import { LineSessionMapper } from '@domain/base/line-session/line-session.mapper';
import { Injectable } from '@nestjs/common';

import { LINE_EVENT_JOBS } from '@app/worker/worker.job';

import { BaseTaskHandler } from '@shared/task/task.abstract';
import { QueueTask } from '@shared/task/task.decorator';

import { LineProcessAiChatCommand } from './line-process-ai-chat/line-process-ai-chat.command';
import { LineProcessAiChatJobInput } from './line-process-ai-chat/line-process-ai-chat.type';
import { LineProcessRawCommand } from './line-process-raw/line-process-raw.command';
import { LineProcessRawJobData } from './line-process-raw/line-process-raw.type';
import { LineProcessSelectionMenuCommand } from './line-process-selection-menu/line-process-selection-menu.command';
import { LineProcessSelectionMenuJobInput } from './line-process-selection-menu/line-process-selection-menu.type';
import { LineProcessVerificationCommand } from './line-process-verification/line-process-verification.command';
import { LineProcessVerificationJobInput } from './line-process-verification/line-process-verification.type';
import { LineShowSelectionMenuCommand } from './line-show-selection-menu/line-show-selection-menu.command';
import { LineShowSelectionMenuJobInput } from './line-show-selection-menu/line-show-selection-menu.type';

@Injectable()
export class LineEventBullmq extends BaseTaskHandler {
  constructor(
    private lineProcessRawCommand: LineProcessRawCommand,
    private lineProcessVerificationCommand: LineProcessVerificationCommand,
    private lineProcessSelectionMenuCommand: LineProcessSelectionMenuCommand,
    private lineShowSelectionMenuCommand: LineShowSelectionMenuCommand,
    private lineProcessAiChatCommand: LineProcessAiChatCommand,
  ) {
    super();
  }

  @QueueTask(LINE_EVENT_JOBS.PROCESS_RAW)
  async processRaw(data: LineProcessRawJobData) {
    return this.lineProcessRawCommand.exec(data);
  }

  @QueueTask(LINE_EVENT_JOBS.PROCESS_VERIFICATION)
  async processVerification(input: LineProcessVerificationJobInput) {
    return this.lineProcessVerificationCommand.exec({
      ...input,
      lineBot: LineBotMapper.fromJsonWithState(input.lineBot),
    });
  }

  @QueueTask(LINE_EVENT_JOBS.PROCESS_SELECTION_MENU)
  async processSelectionMenu(input: LineProcessSelectionMenuJobInput) {
    return this.lineProcessSelectionMenuCommand.exec({
      ...input,
      lineBot: LineBotMapper.fromJsonWithState(input.lineBot),
    });
  }

  @QueueTask(LINE_EVENT_JOBS.SHOW_SELECTION_MENU)
  async showSelectionMenu(input: LineShowSelectionMenuJobInput) {
    return this.lineShowSelectionMenuCommand.exec({
      ...input,
      lineBot: LineBotMapper.fromJsonWithState(input.lineBot),
    });
  }

  @QueueTask(LINE_EVENT_JOBS.PROCESS_AI_CHAT)
  async processAiChat(input: LineProcessAiChatJobInput) {
    return this.lineProcessAiChatCommand.exec({
      lineBot: LineBotMapper.fromJsonWithState(input.lineBotJsonState),
      lineSession: LineSessionMapper.fromJsonWithState(
        input.lineSessionJsonState,
      ),
      data: input.data,
    });
  }
}

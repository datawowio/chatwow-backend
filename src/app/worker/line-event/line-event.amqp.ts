import { lineBotFromJsonWithState } from '@domain/base/line-bot/line-bot.mapper';
import { lineSessionFromJsonWithState } from '@domain/base/line-session/line-session.mapper';
import { Injectable } from '@nestjs/common';

import { BaseAmqpHandler } from '@infra/global/amqp/amqp.abstract';

import { QueueTask } from '@shared/task/task.decorator';

import { LINE_EVENT_QUEUES } from '../worker.constant';
import { OmitTaskMeta } from '../worker.type';
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
export class LineEventAmqp extends BaseAmqpHandler {
  constructor(
    private lineProcessRawCommand: LineProcessRawCommand,
    private lineProcessVerificationCommand: LineProcessVerificationCommand,
    private lineProcessSelectionMenuCommand: LineProcessSelectionMenuCommand,
    private lineShowSelectionMenuCommand: LineShowSelectionMenuCommand,
    private lineProcessAiChatCommand: LineProcessAiChatCommand,
  ) {
    super();
  }

  @QueueTask(LINE_EVENT_QUEUES.PROCESS_RAW)
  async processRaw(data: LineProcessRawJobData) {
    return this.lineProcessRawCommand.exec(data);
  }

  @QueueTask(LINE_EVENT_QUEUES.PROCESS_VERIFICATION)
  async processVerification(
    input: OmitTaskMeta<LineProcessVerificationJobInput>,
  ) {
    return this.lineProcessVerificationCommand.exec({
      ...input,
      lineBot: lineBotFromJsonWithState(input.lineBot),
    });
  }

  @QueueTask(LINE_EVENT_QUEUES.PROCESS_SELECTION_MENU)
  async processSelectionMenu(
    input: OmitTaskMeta<LineProcessSelectionMenuJobInput>,
  ) {
    return this.lineProcessSelectionMenuCommand.exec({
      ...input,
      lineBot: lineBotFromJsonWithState(input.lineBot),
    });
  }

  @QueueTask(LINE_EVENT_QUEUES.SHOW_SELECTION_MENU)
  async showSelectionMenu(input: OmitTaskMeta<LineShowSelectionMenuJobInput>) {
    return this.lineShowSelectionMenuCommand.exec({
      ...input,
      lineBot: lineBotFromJsonWithState(input.lineBot),
    });
  }

  @QueueTask(LINE_EVENT_QUEUES.PROCESS_AI_CHAT)
  async processAiChat(input: OmitTaskMeta<LineProcessAiChatJobInput>) {
    return this.lineProcessAiChatCommand.exec({
      lineBot: lineBotFromJsonWithState(input.lineBot),
      lineSession: lineSessionFromJsonWithState(input.lineSession),
      replyToken: input.replyToken,
      message: input.message,
    });
  }
}

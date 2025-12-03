import { Module } from '@nestjs/common';

import { createMqHandler } from '@shared/common/common.worker';

import { MQ_EXCHANGE } from '../worker.constant';
import { LineEventAmqp } from './line-event.amqp';
import { LineProcessAiChatCommand } from './line-process-ai-chat/line-process-ai-chat.command';
import { LineProcessRawCommand } from './line-process-raw/line-process-raw.command';
import { LineProcessSelectionMenuCommand } from './line-process-selection-menu/line-process-selection-menu.command';
import { LineProcessVerificationCommand } from './line-process-verification/line-process-verification.command';
import { LineShowSelectionMenuCommand } from './line-show-selection-menu/line-show-selection-menu.command';

@Module({
  providers: [
    LineProcessRawCommand,
    LineProcessSelectionMenuCommand,
    LineShowSelectionMenuCommand,
    LineProcessVerificationCommand,
    LineProcessAiChatCommand,

    //
    createMqHandler(MQ_EXCHANGE.LINE_EVENT.name, LineEventAmqp),
  ],
})
export class LineEventWorkerModule {}

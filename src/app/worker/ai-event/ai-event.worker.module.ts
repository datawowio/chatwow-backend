import { Module } from '@nestjs/common';

import { createMqHandler } from '@shared/common/common.worker';

import { MQ_EXCHANGE } from '../worker.constant';
import { AiEventAmqp } from './ai-event.amqp';

@Module({
  providers: [
    //
    createMqHandler(MQ_EXCHANGE.AI_EVENT.name, AiEventAmqp),
  ],
})
export class AiEventWorkerModule {}

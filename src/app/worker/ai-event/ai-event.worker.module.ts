import { Module } from '@nestjs/common';

import { createMqHandler } from '@shared/common/common.worker';

import { MQ_EXCHANGE } from '../worker.constant';
import { AiEventAmqp } from './ai-event.amqp';
import { ProjectDocumentMdSuccessCommand } from './project-document-md-success/project-document-md-success.command';
import { ProjectMdSuccessCommand } from './project-md-success/project-md-success.command';

@Module({
  providers: [
    ProjectMdSuccessCommand,
    ProjectDocumentMdSuccessCommand,

    //
    createMqHandler(MQ_EXCHANGE.AI_EVENT.name, AiEventAmqp),
  ],
})
export class AiEventWorkerModule {}

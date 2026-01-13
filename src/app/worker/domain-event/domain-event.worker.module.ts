import { Module } from '@nestjs/common';

import { createMqHandler } from '@shared/common/common.worker';

import { MQ_EXCHANGE } from '../worker.constant';
import { DomainEventAmqp } from './domain-event.amqp';
import { ForgotPasswordQueueCommand } from './forgot-password/forgot-password.command';
import { ProcessAiUsageCommand } from './process-ai-usage/process-ai-usage.command';
import { SavedProjectDocumentQueueCommand } from './saved-project-document/saved-project-document.command';
import { SavedProjectQueueCommand } from './saved-project/saved-project.command';
import { SendVerificationQueueCommand } from './send-verification/send-verification.command';

@Module({
  providers: [
    SendVerificationQueueCommand,
    ForgotPasswordQueueCommand,
    SavedProjectDocumentQueueCommand,
    SavedProjectQueueCommand,
    ProcessAiUsageCommand,

    //
    createMqHandler(MQ_EXCHANGE.DOMAIN_EVENT.name, DomainEventAmqp),
  ],
})
export class DomainEventWorkerModule {}

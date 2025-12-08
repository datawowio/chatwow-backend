import { Module } from '@nestjs/common';

import { AiEventWorkerModule } from './ai-event/ai-event.worker.module';
import { CronWorkerModule } from './cron/cron.worker.module';
import { DomainEventWorkerModule } from './domain-event/domain-event.worker.module';
import { LineEventWorkerModule } from './line-event/line-event.worker.module';

@Module({
  imports: [
    DomainEventWorkerModule,
    CronWorkerModule,
    LineEventWorkerModule,
    AiEventWorkerModule,
  ],
})
export class WorkerModule {}

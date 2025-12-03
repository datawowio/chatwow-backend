import { Module } from '@nestjs/common';

import { createMqHandler } from '@shared/common/common.worker';

import { MQ_EXCHANGE } from '../worker.constant';
import { CronAmqp } from './cron.amqp';

@Module({
  providers: [createMqHandler(MQ_EXCHANGE.CRON.name, CronAmqp)],
})
export class CronWorkerModule {}

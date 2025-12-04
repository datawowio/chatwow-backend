import { Injectable } from '@nestjs/common';

import { BaseAmqpHandler } from '@infra/global/amqp/amqp.abstract';

import { QueueTask } from '@shared/task/task.decorator';

import { CRON_QUEUES } from '../worker.constant';

@Injectable()
export class CronAmqp extends BaseAmqpHandler {
  @QueueTask(CRON_QUEUES.SAMPLE.name)
  async processSample() {
    console.log('XXxxxXXXXXXXXX');
    console.log(`Cron Test Proccessed`);
    console.log('XXxxxXXXXXXXXX');
  }
}

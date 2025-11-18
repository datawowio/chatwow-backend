import { CRON_JOBS } from '@app/worker/worker.job';
import { QUEUE } from '@app/worker/worker.queue';

import { BaseCronQueue } from '@shared/task/task.abstract';

export class CronSetup extends BaseCronQueue {
  queueName = QUEUE.CRONS;

  async setupCron(): Promise<void> {
    await this.addCron(CRON_JOBS.SAMPLE, '0 0 * * *');
  }
}

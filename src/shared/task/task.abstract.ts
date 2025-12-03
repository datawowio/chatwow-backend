import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Job, JobsOptions, Queue } from 'bullmq';
import { difference } from 'remeda';

import { AppConfig } from '@infra/config';

import { QUEUE } from '@app/worker/worker.queue';

import { TaskMetadata, getTaskHandlers } from './task.decorator';

@Injectable()
export abstract class BaseQueue implements OnModuleInit, OnModuleDestroy {
  abstract queueName: QUEUE;
  protected queue: Queue;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const redisConfig =
      this.configService.getOrThrow<AppConfig['redis']>('redis');

    this.queue = new Queue(this.queueName, {
      connection: { url: redisConfig.url },
    });
  }

  async onModuleDestroy() {
    await this.queue.disconnect();
  }

  addJob(name: string, data: any) {
    this.queue.add(name, data, this._getQueueConfig());
  }

  protected _getQueueConfig(): JobsOptions {
    return {
      removeOnComplete: 20,
      removeOnFail: 50,
    };
  }
}

export abstract class BaseCronQueue extends BaseQueue {
  private _scheduledCronIds: string[];

  abstract setupCron(): Promise<void>;

  async addCron(name: string, pattern: string, data?: any) {
    const jobId = `${name}:${pattern}`;

    // has job id to prevent duplicates
    // for horizontal scale
    const job = await this.queue.add(name, data, {
      repeat: { pattern },
      jobId,
      ...this._getQueueConfig(),
    });

    if (job.repeatJobKey) {
      this._scheduledCronIds.push(job.repeatJobKey);
    }
  }

  private async _cleanUpCrons() {
    const redisScheduledJobs = await this.queue.getJobSchedulers();
    const redisScheduledJobIds = redisScheduledJobs.reduce((acc, job) => {
      if (job.key) {
        acc.push(job.key);
      }
      return acc;
    }, [] as string[]);

    const jobIdsToRemove = difference(
      redisScheduledJobIds,
      this._scheduledCronIds,
    );

    await Promise.all(
      jobIdsToRemove.map(async (id) => this.queue.removeJobScheduler(id)),
    );
  }

  async onModuleInit(): Promise<void> {
    this._scheduledCronIds = [];
    super.onModuleInit();
    await this.setupCron();
    await this._cleanUpCrons();
  }
}

@Injectable()
export abstract class BaseTaskHandler {
  private _taskMap: Record<string, TaskMetadata>;

  constructor() {
    this._taskMap = getTaskHandlers(this);
  }

  async dispatch(job: Job): Promise<void> {
    const metadata = this._taskMap[job.name];
    if (!metadata) {
      throw new Error(`metadata for job ${job.name} not found!`);
    }

    const methodName = metadata.methodName;
    if (!methodName) {
      // this should never happen, but handle just in case
      throw new Error(`unexpected: method name for ${job.name} not found`);
    }

    // handle task pipe
    const parser = metadata.validator;
    if (parser) {
      try {
        job.data = parser(job.data);
      } catch (e: unknown) {
        throw new Error(`failed parsing: ${e}`);
      }
    }

    // handle task
    const method = (this as any)[methodName];
    if (method && typeof method === 'function') {
      await method.call(this, job.data);
    }
  }
}

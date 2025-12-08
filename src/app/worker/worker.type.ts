import { TaskMeta } from '@infra/global/amqp/amqp.common';

export type JobInput<T> = {
  meta: TaskMeta;
  data: T;
};

export type OmitJobMeta<T extends JobInput<object>> = T['data'];

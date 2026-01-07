import { TaskMeta } from '@infra/global/amqp/amqp.common';

export type JobInput<T, M = object> = {
  meta: TaskMeta & M;
  data: T;
};

export type OmitJobMeta<T extends JobInput<object>> = T['data'];

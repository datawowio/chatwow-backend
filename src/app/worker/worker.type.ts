import { TaskMeta } from '@infra/global/amqp/amqp.common';

export type TaskData<T> = {
  meta: TaskMeta;
  data: T;
};

export type OmitTaskMeta<T extends TaskData<object>> = T['data'];

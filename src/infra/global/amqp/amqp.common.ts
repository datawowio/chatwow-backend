import z from 'zod';

import { TaskData } from '@app/worker/worker.type';

import { uuidV7 } from '@shared/common/common.crypto';

export const TaskMetaZod = z.object({
  id: z.string(),
});
export type TaskMeta = z.infer<typeof TaskMetaZod>;

export function newTaskMeta(): TaskMeta {
  return {
    id: uuidV7(),
  };
}
export function wrapJobMeta<T>(data: T): TaskData<T> {
  return {
    meta: newTaskMeta(),
    data,
  };
}

export function createJobParser<T extends z.ZodObject<any>>(zObject: T) {
  return z.object({
    meta: TaskMetaZod,
    data: zObject,
  });
}

export class InvalidJobPayloadParseException extends Error {
  constructor(e: any) {
    super(`failed parsing data, error: ${e['message']}`);
  }
}

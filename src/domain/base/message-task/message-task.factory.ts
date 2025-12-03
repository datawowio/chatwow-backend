import { uuidV7 } from '@shared/common/common.crypto';
import myDayjs from '@shared/common/common.dayjs';
import { valueOr } from '@shared/common/common.func';

import type { MessageTask } from './message-task.domain';
import { messageTaskFromPlain } from './message-task.mapper';
import type { MessageTaskNewData, MessageTaskPlain } from './message-task.type';

export function newMessageTask(data: MessageTaskNewData): MessageTask {
  return messageTaskFromPlain({
    id: data.id,
    createdAt: myDayjs().toDate(),
    updatedAt: myDayjs().toDate(),
    queueName: data.queueName,
    exchangeName: data.exchangeName,
    payload: data.payload,
    messageStatus: valueOr(data.messageStatus, 'SUCCESS'),
    attempts: 1,
    maxAttempts: valueOr(data.maxAttempts, 5),
    expireAt: myDayjs().add(7, 'days').toDate(),
    lastError: null,
  });
}

export function newMessageTasks(data: MessageTaskNewData[]) {
  return data.map((d) => newMessageTask(d));
}

export function mockMessageTask(data?: Partial<MessageTaskPlain>) {
  return messageTaskFromPlain({
    id: valueOr(data?.id, uuidV7()),
    createdAt: valueOr(data?.createdAt, myDayjs().toDate()),
    updatedAt: valueOr(data?.updatedAt, myDayjs().toDate()),
    queueName: valueOr(data?.queueName, 'test-queue'),
    exchangeName: valueOr(data?.exchangeName, 'mock-exchange'),
    payload: valueOr(data?.payload, { test: 'data' }),
    messageStatus: valueOr(data?.messageStatus, 'SUCCESS'),
    attempts: valueOr(data?.attempts, 0),
    expireAt: valueOr(data?.expireAt, myDayjs().add(7, 'days').toDate()),
    maxAttempts: valueOr(data?.maxAttempts, 5),
    lastError: valueOr(data?.lastError, null),
  });
}

export function mockMessageTasks(
  amount: number,
  data?: Partial<MessageTaskPlain>,
) {
  return Array(amount)
    .fill(0)
    .map(() => mockMessageTask(data));
}

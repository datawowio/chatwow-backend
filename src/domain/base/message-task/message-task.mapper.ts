import {
  toDate,
  toISO,
  toResponseDate,
} from '@shared/common/common.transformer';

import { MessageTask } from './message-task.domain';
import type { MessageTaskResponse } from './message-task.response';
import type {
  MessageTaskJson,
  MessageTaskJsonState,
  MessageTaskPg,
  MessageTaskPlain,
} from './message-task.type';

export function messageTaskFromPg(pg: MessageTaskPg): MessageTask {
  const plain: MessageTaskPlain = {
    id: pg.id,
    createdAt: toDate(pg.created_at),
    updatedAt: toDate(pg.updated_at),
    queueName: pg.queue_name,
    exchangeName: pg.exchange_name,
    payload: pg.payload as Record<string, any>,
    messageStatus: pg.message_status,
    attempts: pg.attempts,
    maxAttempts: pg.max_attempts,
    lastError: pg.last_error,
    expireAt: toDate(pg.expire_at),
  };

  return new MessageTask(plain);
}

export function messageTaskFromPgWithState(pg: MessageTaskPg): MessageTask {
  return messageTaskFromPg(pg).setPgState(messageTaskToPg);
}

export function messageTaskFromPlain(plainData: MessageTaskPlain): MessageTask {
  const plain: MessageTaskPlain = {
    id: plainData.id,
    createdAt: plainData.createdAt,
    updatedAt: plainData.updatedAt,
    queueName: plainData.queueName,
    exchangeName: plainData.exchangeName,
    payload: plainData.payload,
    messageStatus: plainData.messageStatus,
    attempts: plainData.attempts,
    maxAttempts: plainData.maxAttempts,
    lastError: plainData.lastError,
    expireAt: plainData.expireAt,
  };

  return new MessageTask(plain);
}

export function messageTaskFromJson(json: MessageTaskJson): MessageTask {
  const plain: MessageTaskPlain = {
    id: json.id,
    createdAt: toDate(json.createdAt),
    updatedAt: toDate(json.updatedAt),
    queueName: json.queueName,
    exchangeName: json.exchangeName,
    payload: json.payload,
    messageStatus: json.messageStatus,
    attempts: json.attempts,
    maxAttempts: json.maxAttempts,
    lastError: json.lastError,
    expireAt: toDate(json.expireAt),
  };

  return new MessageTask(plain);
}

export function messageTaskToPg(messageTask: MessageTask): MessageTaskPg {
  return {
    id: messageTask.id,
    created_at: toISO(messageTask.createdAt),
    updated_at: toISO(messageTask.updatedAt),
    queue_name: messageTask.queueName,
    exchange_name: messageTask.exchangeName,
    payload: messageTask.payload as any,
    message_status: messageTask.messageStatus,
    attempts: messageTask.attempts,
    max_attempts: messageTask.maxAttempts,
    last_error: messageTask.lastError,
    expire_at: toISO(messageTask.expireAt),
  };
}

export function messageTaskToPlain(messageTask: MessageTask): MessageTaskPlain {
  return {
    id: messageTask.id,
    createdAt: messageTask.createdAt,
    updatedAt: messageTask.updatedAt,
    queueName: messageTask.queueName,
    exchangeName: messageTask.exchangeName,
    payload: messageTask.payload,
    messageStatus: messageTask.messageStatus,
    attempts: messageTask.attempts,
    maxAttempts: messageTask.maxAttempts,
    lastError: messageTask.lastError,
    expireAt: messageTask.expireAt,
  };
}

export function messageTaskToResponse(
  messageTask: MessageTask,
): MessageTaskResponse {
  return {
    id: messageTask.id,
    createdAt: toResponseDate(messageTask.createdAt),
    updatedAt: toResponseDate(messageTask.updatedAt),
    queueName: messageTask.queueName,
    exchangeName: messageTask.exchangeName,
    payload: messageTask.payload,
    messageStatus: messageTask.messageStatus,
    attempts: messageTask.attempts,
    maxAttempts: messageTask.maxAttempts,
    lastError: messageTask.lastError,
    expireAt: toResponseDate(messageTask.expireAt),
  };
}

export function messageTaskPgToResponse(
  messageTask: MessageTaskPg,
): MessageTaskResponse {
  return {
    id: messageTask.id,
    createdAt: toResponseDate(messageTask.created_at),
    updatedAt: toResponseDate(messageTask.updated_at),
    queueName: messageTask.queue_name,
    exchangeName: messageTask.exchange_name,
    payload: messageTask.payload as Record<string, any>,
    messageStatus: messageTask.message_status,
    attempts: messageTask.attempts,
    maxAttempts: messageTask.max_attempts,
    lastError: messageTask.last_error,
    expireAt: toResponseDate(messageTask.expire_at),
  };
}

export function messageTaskToJson(messageTask: MessageTask): MessageTaskJson {
  return {
    id: messageTask.id,
    createdAt: toISO(messageTask.createdAt),
    updatedAt: toISO(messageTask.updatedAt),
    queueName: messageTask.queueName,
    exchangeName: messageTask.exchangeName,
    payload: messageTask.payload,
    messageStatus: messageTask.messageStatus,
    attempts: messageTask.attempts,
    maxAttempts: messageTask.maxAttempts,
    lastError: messageTask.lastError,
    expireAt: toISO(messageTask.expireAt),
  };
}

export function messageTaskToJsonWithState(
  messageTask: MessageTask,
): MessageTaskJsonState {
  return {
    state: messageTask.pgState,
    data: messageTaskToJson(messageTask),
  };
}

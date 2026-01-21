import { faker } from '@faker-js/faker';
import type { SetRequired } from 'type-fest';
import { Writable } from 'type-fest';

import { uuidV7 } from '@shared/common/common.crypto';
import myDayjs from '@shared/common/common.dayjs';
import { valueOr } from '@shared/common/common.func';
import { isDefined } from '@shared/common/common.validator';

import { AiUsage } from './ai-usage.domain';
import { aiUsageFromPlain } from './ai-usage.mapper';
import type { AiUsageNewData, AiUsagePlain } from './ai-usage.type';

export function newAiUsage({ actorId, data }: AiUsageNewData): AiUsage {
  return aiUsageFromPlain({
    id: uuidV7(),
    createdAt: myDayjs().toDate(),
    createdById: actorId || null,
    projectId: data.projectId,
    aiRequestAt: myDayjs().toDate(),
    aiReplyAt: null,
    confidence: 0,
    refTable: data.refTable,
    refId: data.refId,
    replyTimeMs: null,
    aiUsageAction: data.aiUsageAction,
  });
}

export function newAiUsages(data: AiUsageNewData[]): AiUsage[] {
  return data.map((d) => newAiUsage(d));
}

export function mockAiUsage(
  data: SetRequired<Partial<AiUsagePlain>, 'projectId' | 'createdById'>,
): AiUsage {
  const requestAt = isDefined(data.aiRequestAt)
    ? data.aiRequestAt
    : myDayjs(
        faker.date.between({
          from: '2025-01-01T00:00:00.000Z',
          to: '2026-01-01T00:00:00.000Z',
        }),
      ).toDate();

  const entity = aiUsageFromPlain({
    id: isDefined(data.id) ? data.id : uuidV7(),
    createdAt: isDefined(data.createdAt) ? data.createdAt : requestAt,
    createdById: data.createdById,
    projectId: data.projectId,
    aiRequestAt: isDefined(data.aiRequestAt) ? data.aiRequestAt : requestAt,
    aiReplyAt: isDefined(data.aiReplyAt)
      ? data.aiReplyAt
      : myDayjs(requestAt)
          .add(faker.number.int({ min: 10, max: 100 }), 'second')
          .toDate(),
    confidence: isDefined(data.confidence)
      ? data.confidence
      : faker.number.int({ min: 1, max: 100 }),
    refTable: valueOr(data.refTable, 'line_chat_logs'),
    refId: valueOr(data.refId, uuidV7()),
    replyTimeMs: isDefined(data.replyTimeMs) ? data.replyTimeMs : 0,
    aiUsageAction: isDefined(data.aiUsageAction)
      ? data.aiUsageAction
      : 'CHAT_LINE',
  });

  const writable = entity as Writable<typeof entity>;
  writable.replyTimeMs = myDayjs(writable.aiReplyAt).diff(
    writable.aiRequestAt,
    'milliseconds',
  );

  return entity;
}

export function mockAiUsages(
  amount: number,
  data: SetRequired<Partial<AiUsagePlain>, 'projectId' | 'createdById'>,
): AiUsage[] {
  return Array(amount)
    .fill(0)
    .map(() => mockAiUsage(data));
}

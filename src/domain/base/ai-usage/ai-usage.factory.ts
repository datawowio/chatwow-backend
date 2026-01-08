import type { SetRequired } from 'type-fest';

import { uuidV7 } from '@shared/common/common.crypto';
import myDayjs from '@shared/common/common.dayjs';
import { isDefined } from '@shared/common/common.validator';

import { AiUsage } from './ai-usage.domain';
import { aiUsageFromPlain } from './ai-usage.mapper';
import type { AiUsageNewData, AiUsagePlain } from './ai-usage.type';

export function newAiUsage(data: AiUsageNewData): AiUsage {
  return aiUsageFromPlain({
    id: uuidV7(),
    createdAt: myDayjs().toDate(),
    userId: data.userId || null,
    projectId: data.projectId,
    aiRequestAt: myDayjs().toDate(),
    aiReplyAt: null,
    tokenUsed: 0,
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
  data: SetRequired<
    Partial<AiUsagePlain>,
    'projectId' | 'userId' | 'refId' | 'refTable'
  >,
): AiUsage {
  return aiUsageFromPlain({
    id: isDefined(data.id) ? data.id : uuidV7(),
    createdAt: isDefined(data.createdAt) ? data.createdAt : myDayjs().toDate(),
    userId: data.userId,
    projectId: data.projectId,
    aiRequestAt: isDefined(data.aiRequestAt)
      ? data.aiRequestAt
      : myDayjs().toDate(),
    aiReplyAt: isDefined(data.aiReplyAt)
      ? data.aiReplyAt
      : myDayjs().add(1, 'second').toDate(),
    tokenUsed: isDefined(data.tokenUsed) ? data.tokenUsed : 100,
    confidence: isDefined(data.confidence) ? data.confidence : 99,
    refTable: data.refTable,
    refId: data.refId,
    replyTimeMs: isDefined(data.replyTimeMs) ? data.replyTimeMs : 0,
    aiUsageAction: isDefined(data.aiUsageAction)
      ? data.aiUsageAction
      : 'CHAT_LINE',
  });
}

export function mockAiUsages(
  amount: number,
  data: SetRequired<
    Partial<AiUsagePlain>,
    'projectId' | 'userId' | 'refId' | 'refTable'
  >,
): AiUsage[] {
  return Array(amount)
    .fill(0)
    .map(() => mockAiUsage(data));
}

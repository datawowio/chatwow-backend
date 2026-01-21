import { faker } from '@faker-js/faker';

import { uuidV7 } from '@shared/common/common.crypto';
import myDayjs from '@shared/common/common.dayjs';
import { valueOr } from '@shared/common/common.func';

import { AI_MODEL_NAME } from '../ai-model/ai-model.constant';
import type { AiUsageToken } from './ai-usage-token.domain';
import { aiUsageTokenFromPlain } from './ai-usage-token.mapper';
import type {
  AiUsageTokenNewData,
  AiUsageTokenPlain,
} from './ai-usage-token.type';

export function newAiUsageToken({ data }: AiUsageTokenNewData): AiUsageToken {
  return aiUsageTokenFromPlain({
    id: uuidV7(),
    createdAt: myDayjs().toDate(),
    aiUsageId: data.aiUsageId,
    aiModelName: data.aiModelName,
    inputTokens: data.inputTokens,
    outputTokens: data.outputTokens,
    totalTokens: data.totalTokens,
    cacheCreationInputTokens: data.cacheCreationInputTokens,
    cacheReadInputTokens: data.cacheReadInputTokens,
    totalPrice: data.totalPrice,
    initialTotalPrice: data.initialTotalPrice,
  });
}

export function newAiUsageTokens(data: AiUsageTokenNewData[]) {
  return data.map((d) => newAiUsageToken(d));
}

export function mockAiUsageToken(data: Partial<AiUsageTokenPlain>) {
  return aiUsageTokenFromPlain({
    id: valueOr(data.id, uuidV7()),
    createdAt: valueOr(data.createdAt, myDayjs().toDate()),
    aiUsageId: valueOr(data.aiUsageId, uuidV7()),
    aiModelName: valueOr(
      data.aiModelName,
      faker.helpers.arrayElement(AI_MODEL_NAME),
    ),
    inputTokens: valueOr(
      data.inputTokens,
      faker.number.int({ min: 0, max: 10000 }),
    ),
    outputTokens: valueOr(
      data.outputTokens,
      faker.number.int({ min: 0, max: 10000 }),
    ),
    totalTokens: valueOr(
      data.totalTokens,
      faker.number.int({ min: 0, max: 20000 }),
    ),
    cacheCreationInputTokens: valueOr(
      data.cacheCreationInputTokens,
      faker.number.int({ min: 0, max: 1000 }),
    ),
    cacheReadInputTokens: valueOr(
      data.cacheReadInputTokens,
      faker.number.int({ min: 0, max: 1000 }),
    ),
    totalPrice: valueOr(
      data.totalPrice,
      faker.number.float({ min: 0, max: 1, fractionDigits: 10 }),
    ),
    initialTotalPrice: valueOr(
      data.initialTotalPrice,
      faker.number.float({ min: 0, max: 1, fractionDigits: 10 }),
    ),
  });
}

export function mockAiUsageTokens(
  amount: number,
  data: Partial<AiUsageTokenPlain>,
) {
  return Array(amount)
    .fill(0)
    .map(() => mockAiUsageToken(data));
}

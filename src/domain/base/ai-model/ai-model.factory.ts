import myDayjs from '@shared/common/common.dayjs';
import { newBig } from '@shared/common/common.func';
import { isDefined } from '@shared/common/common.validator';

import { AiModel } from './ai-model.domain';
import { aiModelFromPlain } from './ai-model.mapper';
import type { AiModelNewData, AiModelPlain } from './ai-model.type';

export function newAiModel(data: AiModelNewData): AiModel {
  return aiModelFromPlain({
    aiModelName: data.aiModel,
    createdAt: myDayjs().toDate(),
    updatedAt: myDayjs().toDate(),
    pricePerToken: data.pricePerToken,
  });
}

export function newAiModels(data: AiModelNewData[]): AiModel[] {
  return data.map((d) => newAiModel(d));
}

export function mockAiModel(data: Partial<AiModelPlain>): AiModel {
  return aiModelFromPlain({
    aiModelName: isDefined(data.aiModelName) ? data.aiModelName : 'GPT_DW',
    createdAt: isDefined(data.createdAt) ? data.createdAt : myDayjs().toDate(),
    updatedAt: isDefined(data.updatedAt) ? data.updatedAt : myDayjs().toDate(),
    pricePerToken: isDefined(data.pricePerToken)
      ? data.pricePerToken
      : newBig(10.0),
  });
}

export function mockAiModels(
  amount: number,
  data: Partial<AiModelPlain>,
): AiModel[] {
  return Array(amount)
    .fill(0)
    .map(() => mockAiModel(data));
}

import myDayjs from '@shared/common/common.dayjs';
import { isDefined } from '@shared/common/common.validator';

import { AiModel } from './ai-model.domain';
import { aiModelFromPlain } from './ai-model.mapper';
import type { AiModelNewData, AiModelPlain } from './ai-model.type';

export function newAiModel(data: AiModelNewData): AiModel {
  return aiModelFromPlain({
    aiModelName: data.aiModel,
    createdAt: myDayjs().toDate(),
    updatedAt: myDayjs().toDate(),
    provider: data.provider,
    config: data.config,
  });
}

export function newAiModels(data: AiModelNewData[]): AiModel[] {
  return data.map((d) => newAiModel(d));
}

export function mockAiModel(data: Partial<AiModelPlain>): AiModel {
  return aiModelFromPlain({
    aiModelName: isDefined(data.aiModelName) ? data.aiModelName : 'gpt-4.1',
    createdAt: isDefined(data.createdAt) ? data.createdAt : myDayjs().toDate(),
    updatedAt: isDefined(data.updatedAt) ? data.updatedAt : myDayjs().toDate(),
    provider: isDefined(data.provider) ? data.provider : 'openai',
    config: isDefined(data.config)
      ? data.config
      : {
          inputRatePerMil: 0.0015,
          cachedInputRatePerMil: 0.0005,
          outputRatePerMil: 0.002,
        },
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

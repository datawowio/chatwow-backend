import type { AiModels } from '@infra/db/db';
import type { DBModel } from '@infra/db/db.common';

import type { Plain, Serialized } from '@shared/common/common.type';

import type { AiModel } from './ai-model.domain';

export type AiModelPg = DBModel<AiModels>;
export type AiModelPlain = Plain<AiModel>;

export type AiModelJson = Serialized<AiModelPlain>;

export type AiModelNewData = {
  aiModel: AiModelName;
  config: AiModelConfig;
  provider: AiModelProvider;
};

export type AiModelProvider = 'openai' | 'claude';
export type AiModelName =
  | 'gpt-4o-mini'
  | 'gpt-4.1'
  | 'gpt-4.1-mini'
  | 'claude-haiku-4-5';

export type AiModelOpenAiConfig = {
  inputRatePerMil: number;
  cachedInputRatePerMil: number;
  outputRatePerMil: number;
};

export type AiModelClaudeConfig = {
  inputRatePerMil: number;
  outputRatePerMil: number;
  cachedReadRatePerMil: number;
  cachedWriteRatePerMil: number;
};

export type AiModelConfig = AiModelOpenAiConfig | AiModelClaudeConfig;

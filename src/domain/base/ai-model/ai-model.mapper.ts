import {
  toDate,
  toISO,
  toResponseDate,
} from '@shared/common/common.transformer';
import type { WithPgState } from '@shared/common/common.type';

import { AiModel } from './ai-model.domain';
import type { AiModelResponse } from './ai-model.response';
import type {
  AiModelConfig,
  AiModelJson,
  AiModelName,
  AiModelPg,
  AiModelPlain,
  AiModelProvider,
} from './ai-model.type';

export function aiModelFromPg(pg: AiModelPg): AiModel {
  const plain: AiModelPlain = {
    aiModelName: pg.ai_model_name as AiModelName,
    createdAt: toDate(pg.created_at),
    updatedAt: toDate(pg.updated_at),
    provider: pg.provider as AiModelProvider,
    config: pg.config as AiModelConfig,
  };

  return aiModelFromPlain(plain);
}

export function aiModelFromPgWithState(pg: AiModelPg): AiModel {
  return aiModelFromPg(pg).setPgState(aiModelToPg);
}

export function aiModelFromPlain(plainData: AiModelPlain): AiModel {
  return new AiModel(plainData);
}

export function aiModelFromJson(json: AiModelJson): AiModel {
  const plain: AiModelPlain = {
    aiModelName: json.aiModelName,
    createdAt: toDate(json.createdAt),
    updatedAt: toDate(json.updatedAt),
    provider: json.provider,
    config: json.config,
  };

  return new AiModel(plain);
}
export function aiModelFromJsonState(
  jsonState: WithPgState<AiModelJson, AiModelPg>,
) {
  const domain = aiModelFromJson(jsonState.data);
  domain.setPgState(jsonState.state);

  return domain;
}

export function aiModelToPg(domain: AiModel): AiModelPg {
  return {
    ai_model_name: domain.aiModelName,
    created_at: toISO(domain.createdAt),
    updated_at: toISO(domain.updatedAt),
    provider: domain.provider,
    config: domain.config,
  };
}

export function aiModelToPlain(domain: AiModel): AiModelPlain {
  return {
    aiModelName: domain.aiModelName,
    createdAt: domain.createdAt,
    updatedAt: domain.updatedAt,
    provider: domain.provider,
    config: domain.config,
  };
}

export function aiModelToJson(domain: AiModel): AiModelJson {
  return {
    aiModelName: domain.aiModelName,
    createdAt: toISO(domain.createdAt),
    updatedAt: toISO(domain.updatedAt),
    provider: domain.provider,
    config: domain.config,
  };
}
export function aiModelToJsonState(
  domain: AiModel,
): WithPgState<AiModelJson, AiModelPg> {
  return {
    state: domain.pgState,
    data: aiModelToJson(domain),
  };
}

export function aiModelToResponse(domain: AiModel): AiModelResponse {
  return {
    aiModel: domain.aiModelName,
    createdAt: toResponseDate(domain.createdAt),
    updatedAt: toResponseDate(domain.updatedAt),
    provider: domain.provider,
  };
}

export function aiModelPgToResponse(pg: AiModelPg): AiModelResponse {
  return aiModelToResponse(aiModelFromPg(pg));
}

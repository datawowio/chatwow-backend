import {
  toDate,
  toISO,
  toResponseDate,
} from '@shared/common/common.transformer';
import type { WithPgState } from '@shared/common/common.type';

import { AiUsageToken } from './ai-usage-token.domain';
import type { AiUsageTokenResponse } from './ai-usage-token.response';
import type {
  AiUsageTokenJson,
  AiUsageTokenPg,
  AiUsageTokenPlain,
} from './ai-usage-token.type';

export function aiUsageTokenFromPg(pg: AiUsageTokenPg): AiUsageToken {
  const plain: AiUsageTokenPlain = {
    id: pg.id,
    createdAt: toDate(pg.created_at),
    aiUsageId: pg.ai_usage_id,
    aiModelName: pg.ai_model_name,
    inputTokens: pg.input_tokens,
    outputTokens: pg.output_tokens,
    totalTokens: pg.total_tokens,
    cacheCreationInputTokens: pg.cache_creation_input_tokens,
    cacheReadInputTokens: pg.cache_read_input_tokens,
    totalPrice: parseFloat(pg.total_price),
    initialTotalPrice: parseFloat(pg.initial_total_price),
  };

  return new AiUsageToken(plain);
}

export function aiUsageTokenFromPgWithState(pg: AiUsageTokenPg): AiUsageToken {
  return aiUsageTokenFromPg(pg).setPgState(aiUsageTokenToPg);
}

export function aiUsageTokenFromPlain(
  plainData: AiUsageTokenPlain,
): AiUsageToken {
  const plain: AiUsageTokenPlain = {
    id: plainData.id,
    createdAt: plainData.createdAt,
    aiUsageId: plainData.aiUsageId,
    aiModelName: plainData.aiModelName,
    inputTokens: plainData.inputTokens,
    outputTokens: plainData.outputTokens,
    totalTokens: plainData.totalTokens,
    cacheCreationInputTokens: plainData.cacheCreationInputTokens,
    cacheReadInputTokens: plainData.cacheReadInputTokens,
    totalPrice: plainData.totalPrice,
    initialTotalPrice: plainData.initialTotalPrice,
  };

  return new AiUsageToken(plain);
}

export function aiUsageTokenFromJson(json: AiUsageTokenJson): AiUsageToken {
  const plain: AiUsageTokenPlain = {
    id: json.id,
    createdAt: toDate(json.createdAt),
    aiUsageId: json.aiUsageId,
    aiModelName: json.aiModelName,
    inputTokens: json.inputTokens,
    outputTokens: json.outputTokens,
    totalTokens: json.totalTokens,
    cacheCreationInputTokens: json.cacheCreationInputTokens,
    cacheReadInputTokens: json.cacheReadInputTokens,
    totalPrice: json.totalPrice,
    initialTotalPrice: json.initialTotalPrice,
  };

  return new AiUsageToken(plain);
}

export function aiUsageTokenFromJsonState(
  jsonState: WithPgState<AiUsageTokenJson, AiUsageTokenPg>,
) {
  const domain = aiUsageTokenFromJson(jsonState.data);
  domain.setPgState(jsonState.state);

  return domain;
}

export function aiUsageTokenToPg(domain: AiUsageToken): AiUsageTokenPg {
  return {
    id: domain.id,
    created_at: toISO(domain.createdAt),
    ai_usage_id: domain.aiUsageId,
    ai_model_name: domain.aiModelName,
    input_tokens: domain.inputTokens,
    output_tokens: domain.outputTokens,
    total_tokens: domain.totalTokens,
    cache_creation_input_tokens: domain.cacheCreationInputTokens,
    cache_read_input_tokens: domain.cacheReadInputTokens,
    total_price: domain.totalPrice.toString(),
    initial_total_price: domain.initialTotalPrice.toString(),
  };
}

export function aiUsageTokenToPlain(domain: AiUsageToken): AiUsageTokenPlain {
  return {
    id: domain.id,
    createdAt: domain.createdAt,
    aiUsageId: domain.aiUsageId,
    aiModelName: domain.aiModelName,
    inputTokens: domain.inputTokens,
    outputTokens: domain.outputTokens,
    totalTokens: domain.totalTokens,
    cacheCreationInputTokens: domain.cacheCreationInputTokens,
    cacheReadInputTokens: domain.cacheReadInputTokens,
    totalPrice: domain.totalPrice,
    initialTotalPrice: domain.initialTotalPrice,
  };
}

export function aiUsageTokenToJson(domain: AiUsageToken): AiUsageTokenJson {
  return {
    id: domain.id,
    createdAt: toISO(domain.createdAt),
    aiUsageId: domain.aiUsageId,
    aiModelName: domain.aiModelName,
    inputTokens: domain.inputTokens,
    outputTokens: domain.outputTokens,
    totalTokens: domain.totalTokens,
    cacheCreationInputTokens: domain.cacheCreationInputTokens,
    cacheReadInputTokens: domain.cacheReadInputTokens,
    totalPrice: domain.totalPrice,
    initialTotalPrice: domain.initialTotalPrice,
  };
}

export function aiUsageTokenToJsonState(
  domain: AiUsageToken,
): WithPgState<AiUsageTokenJson, AiUsageTokenPg> {
  return {
    state: domain.pgState,
    data: aiUsageTokenToJson(domain),
  };
}

export function aiUsageTokenToResponse(
  domain: AiUsageToken,
): AiUsageTokenResponse {
  return {
    id: domain.id,
    createdAt: toResponseDate(domain.createdAt),
    aiUsageId: domain.aiUsageId,
    aiModelName: domain.aiModelName,
    inputTokens: domain.inputTokens,
    outputTokens: domain.outputTokens,
    totalTokens: domain.totalTokens,
    cacheCreationInputTokens: domain.cacheCreationInputTokens,
    cacheReadInputTokens: domain.cacheReadInputTokens,
    totalPrice: domain.totalPrice,
    initialTotalPrice: domain.initialTotalPrice,
  };
}

export function aiUsageTokenPgToResponse(
  pg: AiUsageTokenPg,
): AiUsageTokenResponse {
  return {
    id: pg.id,
    createdAt: toResponseDate(pg.created_at),
    aiUsageId: pg.ai_usage_id,
    aiModelName: pg.ai_model_name,
    inputTokens: pg.input_tokens,
    outputTokens: pg.output_tokens,
    totalTokens: pg.total_tokens,
    cacheCreationInputTokens: pg.cache_creation_input_tokens,
    cacheReadInputTokens: pg.cache_read_input_tokens,
    totalPrice: parseFloat(pg.total_price),
    initialTotalPrice: parseFloat(pg.initial_total_price),
  };
}

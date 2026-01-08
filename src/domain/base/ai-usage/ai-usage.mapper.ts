import { JsonValue } from '@infra/db/db';

import { newBig } from '@shared/common/common.func';
import {
  fromDbCurrency,
  toDate,
  toDbCurrency,
  toISO,
  toResponseDate,
} from '@shared/common/common.transformer';
import type { WithPgState } from '@shared/common/common.type';

import { AiUsageRefTable } from './ai-usage.constant';
import { AiUsage } from './ai-usage.domain';
import type { AiUsageResponse } from './ai-usage.response';
import type { AiUsageJson, AiUsagePg, AiUsagePlain } from './ai-usage.type';

export function aiUsageFromPg(pg: AiUsagePg): AiUsage {
  const plain: AiUsagePlain = {
    id: pg.id,
    createdById: pg.created_by_id,
    projectId: pg.project_id,
    createdAt: toDate(pg.created_at),
    aiRequestAt: toDate(pg.ai_request_at),
    aiReplyAt: toDate(pg.ai_reply_at),
    tokenUsed: pg.token_used,
    confidence: pg.confidence,
    refTable: pg.ref_table as AiUsageRefTable,
    refId: pg.ref_id,
    replyTimeMs: pg.reply_time_ms,
    aiUsageAction: pg.ai_usage_action,
    tokenInfo: pg.token_info as object,
    tokenPrice: fromDbCurrency(pg.token_price),
    aiModelName: pg.ai_model_name,
  };

  return aiUsageFromPlain(plain);
}

export function aiUsageFromPgWithState(pg: AiUsagePg): AiUsage {
  return aiUsageFromPg(pg).setPgState(aiUsageToPg);
}

export function aiUsageFromPlain(plainData: AiUsagePlain): AiUsage {
  const plain: AiUsagePlain = {
    id: plainData.id,
    createdById: plainData.createdById,
    projectId: plainData.projectId,
    createdAt: plainData.createdAt,
    aiRequestAt: plainData.aiRequestAt,
    aiReplyAt: plainData.aiReplyAt,
    tokenUsed: plainData.tokenUsed,
    confidence: plainData.confidence,
    refTable: plainData.refTable,
    refId: plainData.refId,
    replyTimeMs: plainData.replyTimeMs,
    aiUsageAction: plainData.aiUsageAction,
    tokenInfo: plainData.tokenInfo,
    tokenPrice: plainData.tokenPrice,
    aiModelName: plainData.aiModelName,
  };

  return new AiUsage(plain);
}

export function aiUsageFromJson(json: AiUsageJson): AiUsage {
  const plain: AiUsagePlain = {
    id: json.id,
    createdById: json.createdById,
    projectId: json.projectId,
    createdAt: toDate(json.createdAt),
    aiRequestAt: toDate(json.aiRequestAt),
    aiReplyAt: toDate(json.aiReplyAt),
    tokenUsed: json.tokenUsed,
    confidence: json.confidence,
    refTable: json.refTable,
    refId: json.refId,
    replyTimeMs: json.replyTimeMs,
    aiUsageAction: json.aiUsageAction,
    tokenInfo: json.tokenInfo,
    tokenPrice: newBig(json.tokenPrice),
    aiModelName: json.aiModelName,
  };

  return aiUsageFromPlain(plain);
}
export function aiUsageFromJsonState(
  jsonState: WithPgState<AiUsageJson, AiUsagePg>,
) {
  const domain = aiUsageFromJson(jsonState.data);
  domain.setPgState(jsonState.state);

  return domain;
}

export function aiUsageToPg(domain: AiUsage): AiUsagePg {
  if (!domain.aiRequestAt) {
    throw new Error('no ai_request_at data');
  }

  return {
    id: domain.id,
    created_by_id: domain.createdById,
    project_id: domain.projectId,
    created_at: toISO(domain.createdAt),
    ai_request_at: toISO(domain.aiRequestAt),
    ai_reply_at: toISO(domain.aiReplyAt),
    token_used: domain.tokenUsed,
    confidence: domain.confidence,
    ref_table: domain.refTable,
    ref_id: domain.refId,
    reply_time_ms: domain.replyTimeMs,
    ai_usage_action: domain.aiUsageAction,
    token_info: domain.tokenInfo as JsonValue,
    token_price: toDbCurrency(domain.tokenPrice),
    ai_model_name: domain.aiModelName,
  };
}

export function aiUsageToPlain(domain: AiUsage): AiUsagePlain {
  return {
    id: domain.id,
    createdById: domain.createdById,
    projectId: domain.projectId,
    createdAt: domain.createdAt,
    aiRequestAt: domain.aiRequestAt,
    aiReplyAt: domain.aiReplyAt,
    tokenUsed: domain.tokenUsed,
    confidence: domain.confidence,
    refTable: domain.refTable,
    refId: domain.refId,
    replyTimeMs: domain.replyTimeMs,
    aiUsageAction: domain.aiUsageAction,
    tokenInfo: domain.tokenInfo,
    tokenPrice: domain.tokenPrice,
    aiModelName: domain.aiModelName,
  };
}

export function aiUsageToJson(domain: AiUsage): AiUsageJson {
  return {
    id: domain.id,
    createdById: domain.createdById,
    projectId: domain.projectId,
    createdAt: toISO(domain.createdAt),
    aiRequestAt: toISO(domain.aiRequestAt),
    aiReplyAt: toISO(domain.aiReplyAt),
    tokenUsed: domain.tokenUsed,
    confidence: domain.confidence,
    refTable: domain.refTable,
    refId: domain.refId,
    replyTimeMs: domain.replyTimeMs,
    aiUsageAction: domain.aiUsageAction,
    tokenInfo: domain.tokenInfo,
    tokenPrice: domain.tokenPrice.toString(),
    aiModelName: domain.aiModelName,
  };
}
export function aiUsageToJsonState(
  domain: AiUsage,
): WithPgState<AiUsageJson, AiUsagePg> {
  return {
    state: domain.pgState,
    data: aiUsageToJson(domain),
  };
}

export function aiUsageToResponse(domain: AiUsage): AiUsageResponse {
  return {
    id: domain.id,
    projectId: domain.projectId,
    createdAt: toResponseDate(domain.createdAt),
    aiRequestAt: toResponseDate(domain.aiRequestAt),
    aiReplyAt: toResponseDate(domain.aiReplyAt),
    tokenUsed: domain.tokenUsed,
    confidence: domain.confidence,
    refTable: domain.refTable,
    refId: domain.refId,
    replyTimeMs: domain.replyTimeMs,
  };
}

export function aiUsagePgToResponse(pg: AiUsagePg): AiUsageResponse {
  return {
    id: pg.id,
    projectId: pg.project_id,
    createdAt: toResponseDate(pg.created_at),
    aiRequestAt: toResponseDate(pg.ai_request_at),
    aiReplyAt: toResponseDate(pg.ai_reply_at),
    tokenUsed: pg.token_used,
    confidence: pg.confidence,
    refTable: pg.ref_table,
    refId: pg.ref_id,
    replyTimeMs: pg.reply_time_ms,
  };
}

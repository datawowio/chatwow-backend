import { newBig } from '@shared/common/common.func';
import {
  fromDbCurrency,
  toDate,
  toDbCurrency,
  toISO,
  toResponseDate,
} from '@shared/common/common.transformer';
import type { WithPgState } from '@shared/common/common.type';

import { AiUsageUserGroup } from './ai-usage-user-group.domain';
import type { AiUsageUserGroupResponse } from './ai-usage-user-group.response';
import type {
  AiUsageUserGroupJson,
  AiUsageUserGroupPg,
  AiUsageUserGroupPlain,
} from './ai-usage-user-group.type';

export function aiUsageUserGroupFromPg(
  pg: AiUsageUserGroupPg,
): AiUsageUserGroup {
  const plain: AiUsageUserGroupPlain = {
    id: pg.id,
    createdAt: toDate(pg.created_at),
    userGroupId: pg.user_group_id,
    tokenUsed: pg.token_used,
    chatCount: pg.chat_count,
    tokenPrice: fromDbCurrency(pg.token_price),
    aiUsageId: pg.ai_usage_id,
  };

  return aiUsageUserGroupFromPlain(plain);
}

export function aiUsageUserGroupFromPgWithState(
  pg: AiUsageUserGroupPg,
): AiUsageUserGroup {
  return aiUsageUserGroupFromPg(pg).setPgState(aiUsageUserGroupToPg);
}

export function aiUsageUserGroupFromPlain(
  plainData: AiUsageUserGroupPlain,
): AiUsageUserGroup {
  return new AiUsageUserGroup(plainData);
}

export function aiUsageUserGroupFromJson(
  json: AiUsageUserGroupJson,
): AiUsageUserGroup {
  const plain: AiUsageUserGroupPlain = {
    id: json.id,
    createdAt: toDate(json.createdAt),
    userGroupId: json.userGroupId,
    tokenUsed: json.tokenUsed,
    chatCount: json.chatCount,
    tokenPrice: newBig(json.tokenPrice),
    aiUsageId: json.aiUsageId,
  };

  return aiUsageUserGroupFromPlain(plain);
}
export function aiUsageUserGroupFromJsonState(
  jsonState: WithPgState<AiUsageUserGroupJson, AiUsageUserGroupPg>,
) {
  const domain = aiUsageUserGroupFromJson(jsonState.data);
  domain.setPgState(jsonState.state);

  return domain;
}

export function aiUsageUserGroupToPg(
  domain: AiUsageUserGroup,
): AiUsageUserGroupPg {
  return {
    id: domain.id,
    created_at: toISO(domain.createdAt),
    user_group_id: domain.userGroupId,
    token_used: domain.tokenUsed,
    chat_count: domain.chatCount,
    token_price: toDbCurrency(domain.tokenPrice),
    ai_usage_id: domain.aiUsageId,
  };
}

export function aiUsageUserGroupToPlain(
  domain: AiUsageUserGroup,
): AiUsageUserGroupPlain {
  return {
    id: domain.id,
    createdAt: domain.createdAt,
    userGroupId: domain.userGroupId,
    tokenUsed: domain.tokenUsed,
    chatCount: domain.chatCount,
    aiUsageId: domain.aiUsageId,
    tokenPrice: domain.tokenPrice,
  };
}

export function aiUsageUserGroupToJson(
  domain: AiUsageUserGroup,
): AiUsageUserGroupJson {
  return {
    id: domain.id,
    createdAt: toISO(domain.createdAt),
    userGroupId: domain.userGroupId,
    tokenUsed: domain.tokenUsed,
    chatCount: domain.chatCount,
    tokenPrice: domain.tokenPrice.toString(),
    aiUsageId: domain.aiUsageId,
  };
}
export function aiUsageUserGroupToJsonState(
  domain: AiUsageUserGroup,
): WithPgState<AiUsageUserGroupJson, AiUsageUserGroupPg> {
  return {
    state: domain.pgState,
    data: aiUsageUserGroupToJson(domain),
  };
}

export function aiUsageUserGroupToResponse(
  domain: AiUsageUserGroup,
): AiUsageUserGroupResponse {
  return {
    id: domain.id,
    createdAt: toResponseDate(domain.createdAt),
    userGroupId: domain.userGroupId,
    tokenUsed: domain.tokenUsed.toFixed(2),
    chatCount: domain.chatCount.toFixed(2),
    aiUsageId: domain.aiUsageId,
  };
}

export function aiUsageUserGroupPgToResponse(
  pg: AiUsageUserGroupPg,
): AiUsageUserGroupResponse {
  return aiUsageUserGroupToResponse(aiUsageUserGroupFromPg(pg));
}

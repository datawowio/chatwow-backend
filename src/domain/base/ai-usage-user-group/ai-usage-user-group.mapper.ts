import { newBig } from '@shared/common/common.func';
import {
  toDate,
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
    tokenUsed: newBig(pg.token_used),
    chatCount: newBig(pg.chat_count),
    aiUsageId: pg.ai_usage_id,
  };

  return new AiUsageUserGroup(plain);
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
    tokenUsed: newBig(json.tokenUsed),
    chatCount: newBig(json.chatCount),
    aiUsageId: json.aiUsageId,
  };

  return new AiUsageUserGroup(plain);
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
    token_used: domain.tokenUsed.toFixed(2),
    chat_count: domain.chatCount.toFixed(2),
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
  };
}

export function aiUsageUserGroupToJson(
  domain: AiUsageUserGroup,
): AiUsageUserGroupJson {
  return {
    id: domain.id,
    createdAt: toISO(domain.createdAt),
    userGroupId: domain.userGroupId,
    tokenUsed: domain.tokenUsed.toFixed(2),
    chatCount: domain.chatCount.toFixed(2),
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

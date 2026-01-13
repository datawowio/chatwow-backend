import Big from 'big.js';

import type { AiUsageUserGroups } from '@infra/db/db';
import type { DBModel } from '@infra/db/db.common';

import type { Plain, Serialized } from '@shared/common/common.type';

import type { AiUsageUserGroup } from './ai-usage-user-group.domain';

export type AiUsageUserGroupPg = DBModel<AiUsageUserGroups>;
export type AiUsageUserGroupPlain = Plain<AiUsageUserGroup>;

export type AiUsageUserGroupJson = Serialized<AiUsageUserGroupPlain>;

export type AiUsageUserGroupNewData = {
  aiUsageId: string;
  userGroupId: string | null;
  tokenPrice: Big;
  tokenUsed: number;
  chatCount: number;
};

export type AiUsageUserGroupUpdateData = {
  tokenUsed?: number;
  chatCount?: number;
  tokenPrice?: Big;
};

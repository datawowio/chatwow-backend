import Big from 'big.js';

import { DomainEntity } from '@shared/common/common.domain';
import { isDefined } from '@shared/common/common.validator';

import type {
  AiUsageUserGroupPg,
  AiUsageUserGroupPlain,
  AiUsageUserGroupUpdateData,
} from './ai-usage-user-group.type';

export class AiUsageUserGroup extends DomainEntity<AiUsageUserGroupPg> {
  readonly id: string;
  readonly createdAt: Date;
  readonly userGroupId: string | null;
  readonly tokenUsed: Big;
  readonly chatCount: Big;
  readonly aiUsageId: string;

  constructor(plain: AiUsageUserGroupPlain) {
    super();
    Object.assign(this, plain);
  }

  edit(data: AiUsageUserGroupUpdateData) {
    const plain: AiUsageUserGroupPlain = {
      id: this.id,
      createdAt: this.createdAt,
      userGroupId: this.userGroupId,
      aiUsageId: this.aiUsageId,
      tokenUsed: isDefined(data.tokenUsed) ? data.tokenUsed : this.tokenUsed,
      chatCount: isDefined(data.chatCount) ? data.chatCount : this.chatCount,
    };

    Object.assign(this, plain);
  }
}

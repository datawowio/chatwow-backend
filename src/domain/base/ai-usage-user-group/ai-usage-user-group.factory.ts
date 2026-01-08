import { faker } from '@faker-js/faker';
import type { SetRequired } from 'type-fest';

import { uuidV7 } from '@shared/common/common.crypto';
import myDayjs from '@shared/common/common.dayjs';
import { newBig } from '@shared/common/common.func';
import { isDefined } from '@shared/common/common.validator';

import { AiUsageUserGroup } from './ai-usage-user-group.domain';
import { aiUsageUserGroupFromPlain } from './ai-usage-user-group.mapper';
import type {
  AiUsageUserGroupNewData,
  AiUsageUserGroupPlain,
} from './ai-usage-user-group.type';

export function newAiUsageUserGroup(
  data: AiUsageUserGroupNewData,
): AiUsageUserGroup {
  return aiUsageUserGroupFromPlain({
    id: uuidV7(),
    createdAt: myDayjs().toDate(),
    aiUsageId: data.aiUsageId,
    userGroupId: data.userGroupId,
    tokenUsed: data.tokenUsed,
    tokenPrice: data.tokenPrice,
    chatCount: data.chatCount,
  });
}

export function newAiUsageUserGroups(
  data: AiUsageUserGroupNewData[],
): AiUsageUserGroup[] {
  return data.map((d) => newAiUsageUserGroup(d));
}

export function mockAiUsageUserGroup(
  data: SetRequired<Partial<AiUsageUserGroupPlain>, 'aiUsageId'>,
): AiUsageUserGroup {
  return aiUsageUserGroupFromPlain({
    id: isDefined(data.id) ? data.id : uuidV7(),
    createdAt: isDefined(data.createdAt) ? data.createdAt : myDayjs().toDate(),
    aiUsageId: data.aiUsageId,
    userGroupId: isDefined(data.userGroupId) ? data.userGroupId : null,
    tokenUsed: isDefined(data.tokenUsed)
      ? data.tokenUsed
      : newBig(faker.number.int({ min: 10, max: 100 })),
    tokenPrice: isDefined(data.tokenPrice)
      ? data.tokenPrice
      : newBig(faker.number.int({ min: 10, max: 100 })),
    chatCount: isDefined(data.chatCount)
      ? data.chatCount
      : newBig(faker.number.int({ min: 1, max: 10 })),
  });
}

export function mockAiUsageUserGroups(
  amount: number,
  data: SetRequired<Partial<AiUsageUserGroupPlain>, 'aiUsageId'>,
): AiUsageUserGroup[] {
  return Array(amount)
    .fill(0)
    .map(() => mockAiUsageUserGroup(data));
}

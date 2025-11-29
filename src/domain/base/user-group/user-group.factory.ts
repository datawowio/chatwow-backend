import { uuidV7 } from '@shared/common/common.crypto';
import myDayjs from '@shared/common/common.dayjs';
import { isDefined } from '@shared/common/common.validator';

import { userGroupFromPlain } from './user-group.mapper';
import type { UserGroupNewData, UserGroupPlain } from './user-group.type';

export function newUserGroup({ actorId, data }: UserGroupNewData) {
  return userGroupFromPlain({
    id: uuidV7(),
    createdById: actorId,
    updatedById: actorId,
    groupName: data.groupName,
    description: data.description || '',
    createdAt: myDayjs().toDate(),
    updatedAt: myDayjs().toDate(),
  });
}

export function newUserGroups(data: UserGroupNewData[]) {
  return data.map((d) => newUserGroup(d));
}

export function mockUserGroup(data: Partial<UserGroupPlain>) {
  return userGroupFromPlain({
    id: isDefined(data.id) ? data.id : uuidV7(),
    groupName: isDefined(data.groupName) ? data.groupName : 'Test Group',
    description: isDefined(data.description) ? data.description : '',
    createdAt: isDefined(data.createdAt) ? data.createdAt : myDayjs().toDate(),
    updatedAt: isDefined(data.updatedAt) ? data.updatedAt : myDayjs().toDate(),
    createdById: isDefined(data.createdById) ? data.createdById : null,
    updatedById: isDefined(data.updatedById) ? data.updatedById : null,
  });
}

export function mockUserGroups(amount: number, data: Partial<UserGroupPlain>) {
  return Array(amount)
    .fill(0)
    .map(() => mockUserGroup(data));
}

import { faker } from '@faker-js/faker';

import { uuidV7 } from '@shared/common/common.crypto';
import myDayjs from '@shared/common/common.dayjs';
import { firstValueOr, valueOr } from '@shared/common/common.func';

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
    id: valueOr(data.id, uuidV7()),
    groupName: valueOr(data.groupName, faker.company.name()),
    description: valueOr(data.description, ''),
    createdAt: valueOr(data.createdAt, myDayjs().toDate()),
    updatedAt: valueOr(data.updatedAt, myDayjs().toDate()),
    createdById: valueOr(data.createdById, null),
    updatedById: firstValueOr([data.updatedById, data.createdById], null),
  });
}

export function mockUserGroups(amount: number, data: Partial<UserGroupPlain>) {
  return Array(amount)
    .fill(0)
    .map(() => mockUserGroup(data));
}

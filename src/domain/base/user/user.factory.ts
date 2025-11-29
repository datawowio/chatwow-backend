import { hashString, uuidV7 } from '@shared/common/common.crypto';
import myDayjs from '@shared/common/common.dayjs';
import { isDefined } from '@shared/common/common.validator';

import type { User } from './user.domain';
import { userFromPlain } from './user.mapper';
import type { UserNewData, UserPlain } from './user.type';

export function newUser({ actorId, data }: UserNewData): User {
  return userFromPlain({
    id: uuidV7(),
    firstName: data.firstName,
    lastName: data.lastName,
    createdAt: myDayjs().toDate(),
    updatedAt: myDayjs().toDate(),
    createdById: actorId || null,
    updatedById: actorId || null,
    email: data.email,
    password: data.password ? hashString(data.password) : null,
    role: data.role,
    userStatus: isDefined(data.userStatus) ? data.userStatus : 'ACTIVE',
    lineAccountId: data.lineAccountId || null,
    lastSignedInAt: null,
  });
}

export function newUsers(data: UserNewData[]) {
  return data.map((d) => newUser(d));
}

export function mockUser(data: Partial<UserPlain>) {
  return userFromPlain({
    id: isDefined(data.id) ? data.id : uuidV7(),
    createdAt: isDefined(data.createdAt) ? data.createdAt : myDayjs().toDate(),
    updatedAt: isDefined(data.updatedAt) ? data.updatedAt : myDayjs().toDate(),
    email: isDefined(data.email) ? data.email : 'test@example.com',
    password: isDefined(data.password)
      ? data.password
        ? hashString(data.password)
        : null
      : hashString('password'),
    role: isDefined(data.role) ? data.role : 'USER',
    userStatus: isDefined(data.userStatus) ? data.userStatus : 'ACTIVE',
    lineAccountId: isDefined(data.lineAccountId) ? data.lineAccountId : null,
    lastSignedInAt: isDefined(data.lastSignedInAt) ? data.lastSignedInAt : null,

    firstName: isDefined(data.firstName) ? data.firstName : 'firstname',
    lastName: isDefined(data.lastName) ? data.lastName : 'lastname',
    createdById: isDefined(data.createdById) ? data.createdById : null,
    updatedById: isDefined(data.updatedById) ? data.updatedById : null,
  });
}

export function mockUsers(amount: number, data: Partial<UserPlain>) {
  return Array(amount)
    .fill(0)
    .map(() => mockUser(data));
}

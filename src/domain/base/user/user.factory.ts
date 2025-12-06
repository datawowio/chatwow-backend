import { faker } from '@faker-js/faker';

import { hashString, uuidV7 } from '@shared/common/common.crypto';
import myDayjs from '@shared/common/common.dayjs';
import { firstValueOr, valueOr } from '@shared/common/common.func';
import { isDefined } from '@shared/common/common.validator';

import { USER_ROLE, USER_STATUS } from './user.constant';
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
    id: valueOr(data.id, uuidV7()),
    createdAt: valueOr(data.createdAt, myDayjs().toDate()),
    updatedAt: valueOr(data.updatedAt, myDayjs().toDate()),
    email: valueOr(data.email, faker.internet.email()),
    password: isDefined(data.password)
      ? data.password
        ? hashString(data.password)
        : null
      : hashString('password'),
    role: valueOr(data.role, faker.helpers.arrayElement(USER_ROLE)),
    userStatus: valueOr(
      data.userStatus,
      faker.helpers.arrayElement(USER_STATUS),
    ),
    lineAccountId: valueOr(data.lineAccountId, null),
    lastSignedInAt: valueOr(data.lastSignedInAt, null),

    firstName: valueOr(data.firstName, faker.person.firstName()),
    lastName: valueOr(data.lastName, faker.person.lastName()),
    createdById: valueOr(data.createdById, null),
    updatedById: firstValueOr([data.updatedById, data.createdById], null),
  });
}

export function mockUsers(amount: number, data: Partial<UserPlain>) {
  return Array(amount)
    .fill(0)
    .map(() => mockUser(data));
}

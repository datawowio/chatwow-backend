import { uuidV7 } from '@shared/common/common.crypto';
import myDayjs from '@shared/common/common.dayjs';
import { isDefined } from '@shared/common/common.validator';

import { UserVerification } from './user-verification.domain';
import { userVerificationFromPlain } from './user-verification.mapper';
import type {
  UserVerificationNewData,
  UserVerificationPlain,
} from './user-verification.type';
import { generateVerificationCode } from './user-verification.util';

export function newUserVerification(
  data: UserVerificationNewData,
): UserVerification {
  const now = myDayjs();

  return userVerificationFromPlain({
    id: uuidV7(),
    code: generateVerificationCode(),
    createdAt: now.toDate(),
    userId: data.userId,
    expireAt: now.add(10, 'minutes').toDate(),
    revokeAt: null,
  });
}

export function newUserVerifications(
  data: UserVerificationNewData[],
): UserVerification[] {
  return data.map((d) => newUserVerification(d));
}

export function mockUserVerification(
  data: Partial<UserVerificationPlain>,
): UserVerification {
  return userVerificationFromPlain({
    id: isDefined(data.id) ? data.id : generateVerificationCode(),
    createdAt: isDefined(data.createdAt) ? data.createdAt : new Date(),
    userId: isDefined(data.userId) ? data.userId : uuidV7(),
    revokeAt: isDefined(data.revokeAt) ? data.revokeAt : null,
    code: generateVerificationCode(),
    expireAt: isDefined(data.expireAt)
      ? data.expireAt
      : new Date(Date.now() + 5 * 60 * 1000),
  });
}

export function mockUserVerifications(
  amount: number,
  data: Partial<UserVerificationPlain>,
): UserVerification[] {
  return Array(amount)
    .fill(0)
    .map(() => mockUserVerification(data));
}

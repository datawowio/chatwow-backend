import { shaHashstring, uuidV7 } from '@shared/common/common.crypto';
import myDayjs from '@shared/common/common.dayjs';
import { isDefined } from '@shared/common/common.validator';

import { PASSWORD_RESET_DEFAULT_EXPIRY_SECONDS } from './password-reset-token.constant';
import { PasswordResetToken } from './password-reset-token.domain';
import { passwordResetTokenFromPlain } from './password-reset-token.mapper';
import type {
  PasswordResetTokenNewData,
  PasswordResetTokenPlain,
} from './password-reset-token.type';

export function newPasswordResetToken(
  data: PasswordResetTokenNewData,
): PasswordResetToken {
  return passwordResetTokenFromPlain({
    id: uuidV7(),
    userId: data.userId,
    tokenHash: shaHashstring(data.token),
    createdAt: myDayjs().toDate(),
    expireAt: isDefined(data.expireAt)
      ? data.expireAt
      : myDayjs()
          .add(PASSWORD_RESET_DEFAULT_EXPIRY_SECONDS, 'seconds')
          .toDate(),
    revokeAt: null,
  });
}

export function newPasswordResetTokens(
  data: PasswordResetTokenNewData[],
): PasswordResetToken[] {
  return data.map((d) => newPasswordResetToken(d));
}

export function mockPasswordResetToken(
  data: Partial<PasswordResetTokenPlain>,
): PasswordResetToken {
  return passwordResetTokenFromPlain({
    id: isDefined(data.id) ? data.id : 'mock-token-id',
    createdAt: isDefined(data.createdAt) ? data.createdAt : new Date(),
    userId: isDefined(data.userId) ? data.userId : 'mock-user-id',
    tokenHash: isDefined(data.tokenHash) ? data.tokenHash : 'mock-token',
    expireAt: isDefined(data.expireAt)
      ? data.expireAt
      : new Date(Date.now() + 3600 * 1000),
    revokeAt: isDefined(data.revokeAt) ? data.revokeAt : null,
  });
}

export function mockPasswordResetTokens(
  amount: number,
  data: Partial<PasswordResetTokenPlain>,
): PasswordResetToken[] {
  return Array(amount)
    .fill(0)
    .map(() => mockPasswordResetToken(data));
}

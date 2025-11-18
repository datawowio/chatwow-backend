import { generateOTP, uuidV7 } from '@shared/common/common.crypto';
import { isDefined } from '@shared/common/common.validator';

import type { UserOtpPlain } from './types/user-otp.domain.type';
import { UserOtpMapper } from './user-otp.mapper';

export class UserOtpFactory {
  static mock(data: Partial<UserOtpPlain>) {
    return UserOtpMapper.fromPlain({
      id: isDefined(data.id) ? data.id : generateOTP(),
      createdAt: isDefined(data.createdAt) ? data.createdAt : new Date(),
      userId: isDefined(data.userId) ? data.userId : uuidV7(),
      expireAt: isDefined(data.expireAt)
        ? data.expireAt
        : new Date(Date.now() + 5 * 60 * 1000),
    });
  }

  static mockBulk(amount: number, data: Partial<UserOtpPlain>) {
    return Array(amount)
      .fill(0)
      .map(() => this.mock(data));
  }
}

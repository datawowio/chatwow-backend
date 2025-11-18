import { generateOTP } from '@shared/common/common.crypto';
import myDayjs from '@shared/common/common.dayjs';
import { DomainEntity } from '@shared/common/common.domain';
import { isDefined } from '@shared/common/common.validator';

import type {
  UserOtpNewData,
  UserOtpPg,
  UserOtpPlain,
  UserOtpUpdateData,
} from './types/user-otp.domain.type';
import { UserOtpMapper } from './user-otp.mapper';

export class UserOtp extends DomainEntity<UserOtpPg> {
  readonly id: string;
  readonly createdAt: Date;
  readonly userId: string;
  readonly expireAt: Date;

  constructor(plain: UserOtpPlain) {
    super();
    Object.assign(this, plain);
  }

  static new(data: UserOtpNewData) {
    const now = myDayjs();

    return UserOtpMapper.fromPlain({
      id: generateOTP(),
      createdAt: now.toDate(),
      userId: data.userId,
      expireAt: now.add(10, 'minutes').toDate(),
    });
  }

  static newBulk(data: UserOtpNewData[]) {
    return data.map((d) => UserOtp.new(d));
  }

  edit(data: UserOtpUpdateData) {
    const plain: UserOtpPlain = {
      id: this.id,
      createdAt: this.createdAt,
      userId: this.userId,

      // update
      expireAt: isDefined(data.expireAt) ? data.expireAt : this.expireAt,
    };

    Object.assign(this, plain);
  }
}

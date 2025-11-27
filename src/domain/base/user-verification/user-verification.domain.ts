import myDayjs from '@shared/common/common.dayjs';
import { DomainEntity } from '@shared/common/common.domain';
import { isDefined } from '@shared/common/common.validator';

import type {
  UserVerificationNewData,
  UserVerificationPg,
  UserVerificationPlain,
  UserVerificationUpdateData,
} from './types/user-verification.domain.type';
import { UserVerificationMapper } from './user-verification.mapper';
import { generateVerificationCode } from './user-verification.util';

export class UserVerification extends DomainEntity<UserVerificationPg> {
  readonly id: string;
  readonly createdAt: Date;
  readonly userId: string;
  readonly expireAt: Date;
  readonly revokeAt: Date | null;

  constructor(plain: UserVerificationPlain) {
    super();
    Object.assign(this, plain);
  }

  static new(data: UserVerificationNewData) {
    const now = myDayjs();

    return UserVerificationMapper.fromPlain({
      id: generateVerificationCode(),
      createdAt: now.toDate(),
      userId: data.userId,
      expireAt: now.add(10, 'minutes').toDate(),
      revokeAt: null,
    });
  }

  static newBulk(data: UserVerificationNewData[]) {
    return data.map((d) => UserVerification.new(d));
  }

  edit(data: UserVerificationUpdateData) {
    const plain: UserVerificationPlain = {
      id: this.id,
      createdAt: this.createdAt,
      userId: this.userId,

      // update
      revokeAt: isDefined(data.revokeAt) ? data.revokeAt : this.revokeAt,
      expireAt: isDefined(data.expireAt) ? data.expireAt : this.expireAt,
    };

    Object.assign(this, plain);
  }
}

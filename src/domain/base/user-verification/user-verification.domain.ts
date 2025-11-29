import { DomainEntity } from '@shared/common/common.domain';
import { isDefined } from '@shared/common/common.validator';

import { userVerificationFromPlain } from './user-verification.mapper';
import type {
  UserVerificationPg,
  UserVerificationPlain,
  UserVerificationUpdateData,
} from './user-verification.type';

export class UserVerification extends DomainEntity<UserVerificationPg> {
  readonly id: string;
  readonly createdAt: Date;
  readonly code: string;
  readonly userId: string;
  readonly expireAt: Date;
  readonly revokeAt: Date | null;

  constructor(plain: UserVerificationPlain) {
    super();
    Object.assign(this, plain);
  }

  edit(data: UserVerificationUpdateData) {
    const plain: UserVerificationPlain = {
      id: this.id,
      createdAt: this.createdAt,
      userId: this.userId,
      code: this.code,

      // update
      revokeAt: isDefined(data.revokeAt) ? data.revokeAt : this.revokeAt,
      expireAt: isDefined(data.expireAt) ? data.expireAt : this.expireAt,
    };

    return userVerificationFromPlain(plain);
  }
}

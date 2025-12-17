import type { UserRole, UserStatus } from '@infra/db/db';

import { hashString, isMatchedHash } from '@shared/common/common.crypto';
import myDayjs from '@shared/common/common.dayjs';
import { DomainEntity } from '@shared/common/common.domain';
import { isDefined } from '@shared/common/common.validator';

import { userFromPlain, userToPlain } from './user.mapper';
import type { UserPg, UserPlain, UserUpdateData } from './user.type';

export class User extends DomainEntity<UserPg> {
  readonly id: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly email: string;
  readonly password: string | null;
  readonly firstName: string;
  readonly lastName: string;
  readonly role: UserRole;
  readonly userStatus: UserStatus;
  readonly lineAccountId: string | null;
  readonly lastSignedInAt: Date | null;
  readonly createdById: string | null;
  readonly updatedById: string | null;

  constructor(plain: UserPlain) {
    super();
    Object.assign(this, plain);
  }

  edit({ actorId, data }: UserUpdateData) {
    const plain: UserPlain = {
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: myDayjs().toDate(),
      email: isDefined(data.email) ? data.email : this.email,
      createdById: this.createdById,
      updatedById: isDefined(actorId) ? actorId : this.updatedById,
      lastSignedInAt: isDefined(data.lastSignedInAt)
        ? data.lastSignedInAt
        : this.lastSignedInAt,
      password: isDefined(data.password)
        ? !!data.password
          ? hashString(data.password)
          : null
        : this.password,
      role: isDefined(data.role) ? data.role : this.role,
      userStatus: isDefined(data.userStatus)
        ? data.userStatus
        : this.userStatus,
      lineAccountId: isDefined(data.lineAccountId)
        ? data.lineAccountId
        : this.lineAccountId,

      firstName: isDefined(data.firstName) ? data.firstName : this.firstName,
      lastName: isDefined(data.lastName) ? data.lastName : this.lastName,
    };

    Object.assign(this, plain);
  }

  clone() {
    return userFromPlain(userToPlain(this));
  }

  isPasswordValid(rawPassword: string) {
    if (!this.password) {
      return false;
    }

    return isMatchedHash(rawPassword, this.password);
  }

  isAllowLoginAccess() {
    const allowedRole: UserRole[] = ['ADMIN', 'MANAGER'];
    return allowedRole.includes(this.role);
  }
}

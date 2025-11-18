import type { UserRole, UserStatus } from '@infra/db/db';

import { hashString, uuidV7 } from '@shared/common/common.crypto';
import myDayjs from '@shared/common/common.dayjs';
import { DomainEntity } from '@shared/common/common.domain';
import { isDefined } from '@shared/common/common.validator';

import type {
  UserNewData,
  UserPg,
  UserPlain,
  UserUpdateData,
} from './types/user.domain.type';
import { UserMapper } from './user.mapper';

export class User extends DomainEntity<UserPg> {
  readonly id: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly email: string;
  readonly password: string | null;
  readonly role: UserRole;
  readonly userStatus: UserStatus;
  readonly lineAccountId: string | null;
  readonly lastSignedInAt: Date | null;

  constructor(plain: UserPlain) {
    super();
    Object.assign(this, plain);
  }

  static new(data: UserNewData): User {
    return UserMapper.fromPlain({
      id: uuidV7(),
      createdAt: myDayjs().toDate(),
      updatedAt: myDayjs().toDate(),
      email: data.email,
      password: data.password ? hashString(data.password) : null,
      role: data.role,
      userStatus: isDefined(data.userStatus) ? data.userStatus : 'ACTIVE',
      lineAccountId: data.lineAccountId || null,
      lastSignedInAt: null,
    });
  }

  static newBulk(data: UserNewData[]) {
    return data.map((d) => User.new(d));
  }

  edit(data: UserUpdateData) {
    const plain: UserPlain = {
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: myDayjs().toDate(),
      email: isDefined(data.email) ? data.email : this.email,
      lastSignedInAt: isDefined(data.lastSignedInAt)
        ? data.lastSignedInAt
        : this.lastSignedInAt,
      password: isDefined(data.password)
        ? data.password
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
    };

    Object.assign(this, plain);
  }
}

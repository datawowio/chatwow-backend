import type { DBModel } from '@infra/db/db.common';
import type { UserRole, UserStatus, Users } from '@infra/db/db.d';

import type { Plain, Serialized } from '@shared/common/common.type';

import type { User } from '../user.domain';

export type UserPg = DBModel<Users>;
export type UserPlain = Plain<User>;

export type UserJson = Serialized<UserPlain>;

export type UserNewData = {
  email: string;
  password?: string;
  role: UserRole;
  userStatus: UserStatus;
  lineUid?: string;
};

export type UserUpdateData = {
  email?: string;
  password?: string;
  role?: UserRole;
  userStatus?: UserStatus;
  lineUid?: string;
};

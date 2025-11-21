import type { DBModel } from '@infra/db/db.common';
import type { UserRole, UserStatus, Users } from '@infra/db/db.d';

import type { Plain, Serialized } from '@shared/common/common.type';

import type { User } from '../user.domain';

export type UserPg = DBModel<Users>;
export type UserPlain = Plain<User>;

export type UserJson = Serialized<UserPlain>;

export type UserNewData = {
  actorId: string | null;
  data: {
    email: string;
    role: UserRole;
    firstName: string;
    lastName: string;
    password?: string;
    userStatus?: UserStatus;
    lineAccountId?: string;
  };
};

export type UserUpdateData = {
  actorId?: string;
  data: {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    role?: UserRole;
    userStatus?: UserStatus;
    lineAccountId?: string;
    lastSignedInAt?: Date | null;
  };
};

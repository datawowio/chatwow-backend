import type { DBModel } from '@infra/db/db.common';
import type { UserGroupUsers } from '@infra/db/db.d';

import type { Plain } from '@shared/common/common.type';

import type { UserGroupUser } from '../user-group-user.domain';

export type UserGroupUserPg = DBModel<UserGroupUsers>;
export type UserGroupUserPlain = Plain<UserGroupUser>;

export type UserGroupUserJson = UserGroupUserPlain;

export type UserGroupUserNewData = {
  userId?: string;
  userGroupId?: string;
};

export type UserGroupUserUpdateData = {
  userId?: string;
  userGroupId?: string;
};

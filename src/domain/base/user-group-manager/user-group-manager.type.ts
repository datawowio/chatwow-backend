import type { UserGroupManagers } from '@infra/db/db';
import type { DBModel } from '@infra/db/db.common';

import type { Plain } from '@shared/common/common.type';

import type { UserGroupManager } from './user-group-manager.domain';

export type UserGroupManagerPg = DBModel<UserGroupManagers>;
export type UserGroupManagerPlain = Plain<UserGroupManager>;

export type UserGroupManagerJson = UserGroupManagerPlain;

export type UserGroupManagerUpdateData = {
  userId?: string;
  userGroupId?: string;
};

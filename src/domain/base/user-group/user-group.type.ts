import type { UserGroups } from '@infra/db/db';
import type { DBModel } from '@infra/db/db.common';

import type { Plain, Serialized } from '@shared/common/common.type';

import type { UserGroup } from './user-group.domain';

export type UserGroupPg = DBModel<UserGroups>;
export type UserGroupPlain = Plain<UserGroup>;

export type UserGroupJson = Serialized<UserGroupPlain>;

export type UserGroupNewData = {
  actorId: string | null;
  data: {
    groupName: string;
    description?: string;
  };
};

export type UserGroupUpdateData = {
  actorId?: string;
  data: {
    groupName?: string;
    description?: string;
  };
};

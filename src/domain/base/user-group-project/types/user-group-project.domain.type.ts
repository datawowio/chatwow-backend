import type { DBModel } from '@infra/db/db.common';
import type { UserGroupProjects } from '@infra/db/db.d';

import type { Plain, Serialized } from '@shared/common/common.type';

import type { UserGroupProject } from '../user-group-project.domain';

export type UserGroupProjectPg = DBModel<UserGroupProjects>;
export type UserGroupProjectPlain = Plain<UserGroupProject>;

export type UserGroupProjectJson = Serialized<UserGroupProjectPlain>;

export type UserGroupProjectNewData = {
  projectId: string;
  userGroupId: string;
};

export type UserGroupProjectUpdateData = {
  projectId?: string;
  userGroupId?: string;
};

import type { UserManageProjects } from '@infra/db/db';
import type { DBModel } from '@infra/db/db.common';

import type { Plain, Serialized } from '@shared/common/common.type';

import type { UserManageProject } from './user-manage-project.domain';

export type UserManageProjectPg = DBModel<UserManageProjects>;
export type UserManageProjectPlain = Plain<UserManageProject>;
export type UserManageProjectJson = Serialized<UserManageProjectPlain>;

export type UserManageProjectNewData = {
  userId: string;
  projectId: string;
};

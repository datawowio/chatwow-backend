import { toDate, toISO } from '@shared/common/common.transformer';

import { UserManageProject } from './user-manage-project.domain';
import type { UserManageProjectResponse } from './user-manage-project.response';
import type {
  UserManageProjectPg,
  UserManageProjectPlain,
} from './user-manage-project.type';

export function userManageProjectFromPg(
  pg: UserManageProjectPg,
): UserManageProject {
  const plain: UserManageProjectPlain = {
    createdAt: toDate(pg.created_at),
    projectId: pg.project_id,
    userId: pg.user_id,
  };

  return new UserManageProject(plain);
}

export function userManageProjectFromPgWithState(
  pg: UserManageProjectPg,
): UserManageProject {
  return userManageProjectFromPg(pg).setPgState(userManageProjectToPg);
}

export function userManageProjectFromPlain(
  plain: UserManageProjectPlain,
): UserManageProject {
  return new UserManageProject({
    createdAt: plain.createdAt,
    projectId: plain.projectId,
    userId: plain.userId,
  });
}

export function userManageProjectToPg(
  domain: UserManageProjectPlain,
): UserManageProjectPg {
  return {
    created_at: toISO(domain.createdAt),
    project_id: domain.projectId,
    user_id: domain.userId,
  };
}

export function userManageProjectToPlain(
  domain: UserManageProject,
): UserManageProjectPlain {
  return {
    createdAt: domain.createdAt,
    projectId: domain.projectId,
    userId: domain.userId,
  };
}

export function userManageProjectToResponse(
  domain: UserManageProject,
): UserManageProjectResponse {
  return {
    createdAt: toISO(domain.createdAt),
    projectId: domain.projectId,
    userId: domain.userId,
  };
}

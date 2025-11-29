import { UserGroupProject } from './user-group-project.domain';
import type {
  UserGroupProjectJson,
  UserGroupProjectPg,
  UserGroupProjectPlain,
} from './user-group-project.type';

export function userGroupProjectFromPg(
  pg: UserGroupProjectPg,
): UserGroupProject {
  const plain: UserGroupProjectPlain = {
    projectId: pg.project_id,
    userGroupId: pg.user_group_id,
  };

  return new UserGroupProject(plain);
}

export function userGroupProjectFromPgWithState(
  pg: UserGroupProjectPg,
): UserGroupProject {
  return userGroupProjectFromPg(pg).setPgState(userGroupProjectToPg);
}

export function userGroupProjectFromPlain(
  plainData: UserGroupProjectPlain,
): UserGroupProject {
  const plain: UserGroupProjectPlain = {
    projectId: plainData.projectId,
    userGroupId: plainData.userGroupId,
  };

  return new UserGroupProject(plain);
}

export function userGroupProjectFromJson(
  json: UserGroupProjectJson,
): UserGroupProject {
  const plain: UserGroupProjectPlain = {
    projectId: json.projectId,
    userGroupId: json.userGroupId,
  };

  return new UserGroupProject(plain);
}

export function userGroupProjectToPg(
  userGroupProject: UserGroupProjectPlain,
): UserGroupProjectPg {
  return {
    project_id: userGroupProject.projectId,
    user_group_id: userGroupProject.userGroupId,
  };
}

export function userGroupProjectToPlain(
  userGroupProject: UserGroupProject,
): UserGroupProjectPlain {
  return {
    projectId: userGroupProject.projectId,
    userGroupId: userGroupProject.userGroupId,
  };
}

export function userGroupProjectToJson(
  userGroupProject: UserGroupProject,
): UserGroupProjectJson {
  return {
    projectId: userGroupProject.projectId,
    userGroupId: userGroupProject.userGroupId,
  };
}

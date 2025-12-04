import { UserGroupManager } from './user-group-manager.domain';
import type { UserGroupManagerResponse } from './user-group-manager.response';
import type {
  UserGroupManagerJson,
  UserGroupManagerPg,
  UserGroupManagerPlain,
} from './user-group-manager.type';

export function userGroupManagerFromPg(
  pg: UserGroupManagerPg,
): UserGroupManager {
  const plain: UserGroupManagerPlain = {
    userId: pg.user_id,
    userGroupId: pg.user_group_id,
  };

  return new UserGroupManager(plain);
}

export function userGroupManagerFromPgWithState(
  pg: UserGroupManagerPg,
): UserGroupManager {
  return userGroupManagerFromPg(pg).setPgState(userGroupManagerToPg);
}

export function userGroupManagerFromPlain(
  plainData: UserGroupManagerPlain,
): UserGroupManager {
  const plain: UserGroupManagerPlain = {
    userId: plainData.userId,
    userGroupId: plainData.userGroupId,
  };

  return new UserGroupManager(plain);
}

export function userGroupManagerFromJson(
  json: UserGroupManagerJson,
): UserGroupManager {
  const plain: UserGroupManagerPlain = {
    userId: json.userId,
    userGroupId: json.userGroupId,
  };

  return new UserGroupManager(plain);
}

export function userGroupManagerToPg(
  userGroupManager: UserGroupManagerPlain,
): UserGroupManagerPg {
  return {
    user_id: userGroupManager.userId,
    user_group_id: userGroupManager.userGroupId,
  };
}

export function userGroupManagerToPlain(
  userGroupManager: UserGroupManager,
): UserGroupManagerPlain {
  return {
    userId: userGroupManager.userId,
    userGroupId: userGroupManager.userGroupId,
  };
}

export function userGroupManagerToJson(
  userGroupManager: UserGroupManager,
): UserGroupManagerJson {
  return {
    userId: userGroupManager.userId,
    userGroupId: userGroupManager.userGroupId,
  };
}

export function userGroupManagerToResponse(
  userGroupManager: UserGroupManager,
): UserGroupManagerResponse {
  return {
    userId: userGroupManager.userId,
    userGroupId: userGroupManager.userGroupId,
  };
}

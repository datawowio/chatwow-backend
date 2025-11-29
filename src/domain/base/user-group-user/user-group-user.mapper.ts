import { UserGroupUser } from './user-group-user.domain';
import type { UserGroupUserResponse } from './user-group-user.response';
import type {
  UserGroupUserJson,
  UserGroupUserPg,
  UserGroupUserPlain,
} from './user-group-user.type';

export function userGroupUserFromPg(pg: UserGroupUserPg): UserGroupUser {
  const plain: UserGroupUserPlain = {
    userId: pg.user_id,
    userGroupId: pg.user_group_id,
  };

  return new UserGroupUser(plain);
}

export function userGroupUserFromPgWithState(
  pg: UserGroupUserPg,
): UserGroupUser {
  return userGroupUserFromPg(pg).setPgState(userGroupUserToPg);
}

export function userGroupUserFromPlain(
  plainData: UserGroupUserPlain,
): UserGroupUser {
  const plain: UserGroupUserPlain = {
    userId: plainData.userId,
    userGroupId: plainData.userGroupId,
  };

  return new UserGroupUser(plain);
}

export function userGroupUserFromJson(json: UserGroupUserJson): UserGroupUser {
  const plain: UserGroupUserPlain = {
    userId: json.userId,
    userGroupId: json.userGroupId,
  };

  return new UserGroupUser(plain);
}

export function userGroupUserToPg(
  userGroupUser: UserGroupUserPlain,
): UserGroupUserPg {
  return {
    user_id: userGroupUser.userId,
    user_group_id: userGroupUser.userGroupId,
  };
}

export function userGroupUserToPlain(
  userGroupUser: UserGroupUser,
): UserGroupUserPlain {
  return {
    userId: userGroupUser.userId,
    userGroupId: userGroupUser.userGroupId,
  };
}

export function userGroupUserToJson(
  userGroupUser: UserGroupUser,
): UserGroupUserJson {
  return {
    userId: userGroupUser.userId,
    userGroupId: userGroupUser.userGroupId,
  };
}

export function userGroupUserToResponse(
  userGroupUser: UserGroupUser,
): UserGroupUserResponse {
  return {
    userId: userGroupUser.userId,
    userGroupId: userGroupUser.userGroupId,
  };
}

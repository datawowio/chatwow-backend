import type {
  UserGroupUserJson,
  UserGroupUserPg,
  UserGroupUserPlain,
} from './types/user-group-user.domain.type';
import { UserGroupUser } from './user-group-user.domain';

export class UserGroupUserMapper {
  static fromPg(pg: UserGroupUserPg): UserGroupUser {
    const plain: UserGroupUserPlain = {
      id: pg.id,
      userId: pg.user_id,
      userGroupId: pg.user_group_id,
    };

    return new UserGroupUser(plain);
  }

  static fromPgWithState(pg: UserGroupUserPg): UserGroupUser {
    return this.fromPg(pg).setPgState(this.toPg);
  }

  static fromPlain(plainData: UserGroupUserPlain): UserGroupUser {
    const plain: UserGroupUserPlain = {
      id: plainData.id,
      userId: plainData.userId,
      userGroupId: plainData.userGroupId,
    };

    return new UserGroupUser(plain);
  }

  static fromJson(json: UserGroupUserJson): UserGroupUser {
    const plain: UserGroupUserPlain = {
      id: json.id,
      userId: json.userId,
      userGroupId: json.userGroupId,
    };

    return new UserGroupUser(plain);
  }

  static toPg(userGroupUser: UserGroupUserPlain): UserGroupUserPg {
    return {
      id: userGroupUser.id,
      user_id: userGroupUser.userId,
      user_group_id: userGroupUser.userGroupId,
    };
  }

  static toPlain(userGroupUser: UserGroupUser): UserGroupUserPlain {
    return {
      id: userGroupUser.id,
      userId: userGroupUser.userId,
      userGroupId: userGroupUser.userGroupId,
    };
  }

  static toJson(userGroupUser: UserGroupUser): UserGroupUserJson {
    return {
      id: userGroupUser.id,
      userId: userGroupUser.userId,
      userGroupId: userGroupUser.userGroupId,
    };
  }

  static toResponse(userGroupUser: UserGroupUser) {
    return {
      id: userGroupUser.id,
      userId: userGroupUser.userId,
      userGroupId: userGroupUser.userGroupId,
    };
  }
}

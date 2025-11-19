import type {
  UserGroupJson,
  UserGroupPg,
  UserGroupPlain,
} from './types/user-group.domain.type';
import { UserGroup } from './user-group.domain';

export class UserGroupMapper {
  static fromPg(pg: UserGroupPg): UserGroup {
    const plain: UserGroupPlain = {
      id: pg.id,
      groupName: pg.group_name,
      description: pg.description,
    };

    return new UserGroup(plain);
  }

  static fromPgWithState(pg: UserGroupPg): UserGroup {
    return this.fromPg(pg).setPgState(this.toPg);
  }

  static fromPlain(plainData: UserGroupPlain): UserGroup {
    const plain: UserGroupPlain = {
      id: plainData.id,
      groupName: plainData.groupName,
      description: plainData.description,
    };

    return new UserGroup(plain);
  }

  static fromJson(json: UserGroupJson): UserGroup {
    const plain: UserGroupPlain = {
      id: json.id,
      groupName: json.groupName,
      description: json.description,
    };

    return new UserGroup(plain);
  }

  static toPg(userGroup: UserGroup): UserGroupPg {
    return {
      id: userGroup.id,
      group_name: userGroup.groupName,
      description: userGroup.description,
    };
  }

  static toPlain(userGroup: UserGroup): UserGroupPlain {
    return {
      id: userGroup.id,
      groupName: userGroup.groupName,
      description: userGroup.description,
    };
  }

  static toJson(userGroup: UserGroup): UserGroupJson {
    return {
      id: userGroup.id,
      groupName: userGroup.groupName,
      description: userGroup.description,
    };
  }

  static toResponse(userGroup: UserGroup) {
    return {
      id: userGroup.id,
      groupName: userGroup.groupName,
      description: userGroup.description,
    };
  }

  static pgToResponse(pg: UserGroupPg) {
    return {
      id: pg.id,
      groupName: pg.group_name,
      description: pg.description,
    };
  }
}

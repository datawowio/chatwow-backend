import myDayjs from '@shared/common/common.dayjs';
import { toDate, toISO } from '@shared/common/common.transformer';

import type {
  UserGroupJson,
  UserGroupPg,
  UserGroupPlain,
} from './types/user-group.domain.type';
import { UserGroup } from './user-group.domain';
import type { UserGroupResponse } from './user-group.response';

export class UserGroupMapper {
  static fromPg(pg: UserGroupPg): UserGroup {
    const plain: UserGroupPlain = {
      id: pg.id,
      groupName: pg.group_name,
      description: pg.description,
      createdAt: toDate(pg.created_at),
      updatedAt: toDate(pg.updated_at),
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
      createdAt: plainData.createdAt,
      updatedAt: plainData.updatedAt,
    };

    return new UserGroup(plain);
  }

  static fromJson(json: UserGroupJson): UserGroup {
    const plain: UserGroupPlain = {
      id: json.id,
      groupName: json.groupName,
      description: json.description,
      createdAt: myDayjs().toDate(),
      updatedAt: myDayjs().toDate(),
    };

    return new UserGroup(plain);
  }

  static toPg(userGroup: UserGroup): UserGroupPg {
    return {
      id: userGroup.id,
      group_name: userGroup.groupName,
      description: userGroup.description,
      created_at: toISO(userGroup.createdAt),
      updated_at: toISO(userGroup.updatedAt),
    };
  }

  static toPlain(userGroup: UserGroup): UserGroupPlain {
    return {
      id: userGroup.id,
      groupName: userGroup.groupName,
      description: userGroup.description,
      createdAt: userGroup.createdAt,
      updatedAt: userGroup.updatedAt,
    };
  }

  static toJson(userGroup: UserGroup): UserGroupJson {
    return {
      id: userGroup.id,
      groupName: userGroup.groupName,
      description: userGroup.description,
      createdAt: toISO(userGroup.createdAt),
      updatedAt: toISO(userGroup.updatedAt),
    };
  }

  static toResponse(userGroup: UserGroup): UserGroupResponse {
    return {
      id: userGroup.id,
      groupName: userGroup.groupName,
      description: userGroup.description,
      createdAt: toISO(userGroup.createdAt),
      updatedAt: toISO(userGroup.updatedAt),
    };
  }

  static pgToResponse(pg: UserGroupPg): UserGroupResponse {
    return {
      id: pg.id,
      groupName: pg.group_name,
      description: pg.description,
      createdAt: toISO(pg.created_at),
      updatedAt: toISO(pg.updated_at),
    };
  }
}

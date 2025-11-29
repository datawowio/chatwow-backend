import myDayjs from '@shared/common/common.dayjs';
import { toDate, toISO } from '@shared/common/common.transformer';

import { UserGroup } from './user-group.domain';
import type { UserGroupResponse } from './user-group.response';
import type {
  UserGroupJson,
  UserGroupPg,
  UserGroupPlain,
} from './user-group.type';

export function userGroupFromPg(pg: UserGroupPg): UserGroup {
  const plain: UserGroupPlain = {
    id: pg.id,
    groupName: pg.group_name,
    createdById: pg.created_by_id,
    updatedById: pg.updated_by_id,
    description: pg.description,
    createdAt: toDate(pg.created_at),
    updatedAt: toDate(pg.updated_at),
  };

  return new UserGroup(plain);
}

export function userGroupFromPgWithState(pg: UserGroupPg): UserGroup {
  return userGroupFromPg(pg).setPgState(userGroupToPg);
}

export function userGroupFromPlain(plainData: UserGroupPlain): UserGroup {
  const plain: UserGroupPlain = {
    id: plainData.id,
    groupName: plainData.groupName,
    createdById: plainData.createdById,
    updatedById: plainData.updatedById,
    description: plainData.description,
    createdAt: plainData.createdAt,
    updatedAt: plainData.updatedAt,
  };

  return new UserGroup(plain);
}

export function userGroupFromJson(json: UserGroupJson): UserGroup {
  const plain: UserGroupPlain = {
    id: json.id,
    groupName: json.groupName,
    createdById: json.createdById,
    updatedById: json.updatedById,
    description: json.description,
    createdAt: myDayjs().toDate(),
    updatedAt: myDayjs().toDate(),
  };

  return new UserGroup(plain);
}

export function userGroupToPg(userGroup: UserGroup): UserGroupPg {
  return {
    id: userGroup.id,
    group_name: userGroup.groupName,
    created_by_id: userGroup.createdById,
    updated_by_id: userGroup.updatedById,
    description: userGroup.description,
    created_at: toISO(userGroup.createdAt),
    updated_at: toISO(userGroup.updatedAt),
  };
}

export function userGroupToPlain(userGroup: UserGroup): UserGroupPlain {
  return {
    id: userGroup.id,
    groupName: userGroup.groupName,
    createdById: userGroup.createdById,
    updatedById: userGroup.updatedById,
    description: userGroup.description,
    createdAt: userGroup.createdAt,
    updatedAt: userGroup.updatedAt,
  };
}

export function userGroupToJson(userGroup: UserGroup): UserGroupJson {
  return {
    id: userGroup.id,
    groupName: userGroup.groupName,
    description: userGroup.description,
    createdById: userGroup.createdById,
    updatedById: userGroup.updatedById,
    createdAt: toISO(userGroup.createdAt),
    updatedAt: toISO(userGroup.updatedAt),
  };
}

export function userGroupToResponse(userGroup: UserGroup): UserGroupResponse {
  return {
    id: userGroup.id,
    groupName: userGroup.groupName,
    description: userGroup.description,
    createdAt: toISO(userGroup.createdAt),
    updatedAt: toISO(userGroup.updatedAt),
  };
}

export function userGroupPgToResponse(pg: UserGroupPg): UserGroupResponse {
  return {
    id: pg.id,
    groupName: pg.group_name,
    description: pg.description,
    createdAt: toISO(pg.created_at),
    updatedAt: toISO(pg.updated_at),
  };
}

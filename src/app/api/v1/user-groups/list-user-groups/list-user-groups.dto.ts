import { ProjectResponse } from '@domain/base/project/project.response';
import { UserGroupResponse } from '@domain/base/user-group/user-group.response';
import {
  userGroupFilterZod,
  userGroupSortZod,
} from '@domain/base/user-group/user-group.zod';
import { UserResponse } from '@domain/base/user/user.response';
import { ApiProperty } from '@nestjs/swagger';
import z from 'zod';

import { IDomainData } from '@shared/common/common.type';
import {
  PaginationMetaResponse,
  StandardResponse,
} from '@shared/http/http.response.dto';
import { paginationZod, zodDto } from '@shared/zod/zod.util';

import { userGroupsV1IncludesZod } from '../user-groups.v1.util';

// ================ Request ================

const zod = z.object({
  includes: userGroupsV1IncludesZod,
  sort: userGroupSortZod,
  filter: userGroupFilterZod,
  countFilter: userGroupFilterZod,
  pagination: paginationZod,
});

export class ListUserGroupsDto extends zodDto(zod) {}

// ================ Response ================

export class ListUserGroupsResponseDataUserGroupsRelationsUsers {
  @ApiProperty({ type: () => UserResponse })
  attributes?: UserResponse;
}

export class ListUserGroupsResponseDataUserGroupsRelationsProjects {
  @ApiProperty({ type: () => ProjectResponse })
  attributes?: ProjectResponse;
}

export class ListUserGroupsResponseDataUserGroupsRelationsCreatedBy {
  @ApiProperty({ type: () => UserResponse })
  attributes: UserResponse;
}

export class ListUserGroupsResponseDataUserGroupsRelationsUpdatedBy {
  @ApiProperty({ type: () => UserResponse })
  attributes: UserResponse;
}

export class ListUserGroupsResponseDataUserGroupsRelations {
  @ApiProperty({
    type: () => ListUserGroupsResponseDataUserGroupsRelationsProjects,
    isArray: true,
  })
  projects?: ListUserGroupsResponseDataUserGroupsRelationsProjects[];

  @ApiProperty({
    type: () => ListUserGroupsResponseDataUserGroupsRelationsUsers,
    isArray: true,
  })
  users?: ListUserGroupsResponseDataUserGroupsRelationsUsers[];

  @ApiProperty({
    type: () => ListUserGroupsResponseDataUserGroupsRelationsCreatedBy,
  })
  createdBy?: ListUserGroupsResponseDataUserGroupsRelationsCreatedBy;

  @ApiProperty({
    type: () => ListUserGroupsResponseDataUserGroupsRelationsUpdatedBy,
  })
  updatedBy?: ListUserGroupsResponseDataUserGroupsRelationsUpdatedBy;
}

export class ListUserGroupsResponseDataUserGroups implements IDomainData {
  @ApiProperty({ type: () => UserGroupResponse })
  attributes: UserGroupResponse;

  @ApiProperty({ type: () => ListUserGroupsResponseDataUserGroupsRelations })
  relations?: ListUserGroupsResponseDataUserGroupsRelations;
}

export class ListUserGroupsResponseData {
  @ApiProperty({
    type: () => ListUserGroupsResponseDataUserGroups,
    isArray: true,
  })
  userGroups: ListUserGroupsResponseDataUserGroups[];
}

export class ListUserGroupsResponse extends StandardResponse {
  @ApiProperty({ type: () => ListUserGroupsResponseData })
  data: ListUserGroupsResponseData;

  @ApiProperty({ type: () => PaginationMetaResponse })
  meta: PaginationMetaResponse;
}

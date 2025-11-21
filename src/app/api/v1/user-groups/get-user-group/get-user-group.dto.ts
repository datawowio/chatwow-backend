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
import { StandardResponse } from '@shared/http/http.response.dto';
import { paginationZod, zodDto } from '@shared/zod/zod.util';

import { userGroupsV1IncludesZod } from '../user-groups.v1.util';

// ================ Request ================

const zod = z.object({
  includes: userGroupsV1IncludesZod,
  sort: userGroupSortZod,
  filter: userGroupFilterZod,
  pagination: paginationZod,
});

export class GetUserGroupDto extends zodDto(zod) {}

// ================ Response ================

export class GetUserGroupResponseDataUserGroupsRelationsUsers {
  @ApiProperty({ type: () => UserResponse })
  attributes?: UserResponse;
}

export class GetUserGroupResponseDataUserGroupsRelationsProjects {
  @ApiProperty({ type: () => ProjectResponse })
  attributes?: ProjectResponse;
}

export class GetUserGroupsResponseDataUserGroupsRelationsCreatedBy {
  @ApiProperty({ type: () => UserResponse })
  attributes: UserResponse;
}

export class GetUserGroupsResponseDataUserGroupsRelationsUpdatedBy {
  @ApiProperty({ type: () => UserResponse })
  attributes: UserResponse;
}

export class GetUserGroupResponseDataUserGroupsRelations {
  @ApiProperty({
    type: () => GetUserGroupResponseDataUserGroupsRelationsProjects,
    isArray: true,
  })
  projects?: GetUserGroupResponseDataUserGroupsRelationsProjects[];

  @ApiProperty({
    type: () => GetUserGroupResponseDataUserGroupsRelationsUsers,
    isArray: true,
  })
  users?: GetUserGroupResponseDataUserGroupsRelationsUsers[];

  @ApiProperty({
    type: () => GetUserGroupsResponseDataUserGroupsRelationsCreatedBy,
  })
  createdBy?: GetUserGroupsResponseDataUserGroupsRelationsCreatedBy;

  @ApiProperty({
    type: () => GetUserGroupsResponseDataUserGroupsRelationsUpdatedBy,
  })
  updatedBy?: GetUserGroupsResponseDataUserGroupsRelationsUpdatedBy;
}

export class GetUserGroupResponseDataUserGroups implements IDomainData {
  @ApiProperty({ type: () => UserGroupResponse })
  attributes: UserGroupResponse;

  @ApiProperty({ type: () => GetUserGroupResponseDataUserGroupsRelations })
  relations?: GetUserGroupResponseDataUserGroupsRelations;
}

export class GetUserGroupResponseData {
  userGroup: GetUserGroupResponseDataUserGroups;
}

export class GetUserGroupResponse extends StandardResponse {
  data: GetUserGroupResponseData;
}

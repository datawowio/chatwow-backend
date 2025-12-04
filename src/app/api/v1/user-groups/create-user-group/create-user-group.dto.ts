import { ProjectResponse } from '@domain/base/project/project.response';
import { UserGroupResponse } from '@domain/base/user-group/user-group.response';
import { UserResponse } from '@domain/base/user/user.response';
import { ApiProperty } from '@nestjs/swagger';
import z from 'zod';

import { IDomainData } from '@shared/common/common.type';
import { StandardResponse } from '@shared/http/http.response.dto';
import { zodDto } from '@shared/zod/zod.util';

// ================ Request ================

const zod = z.object({
  userGroup: z.object({
    groupName: z.string(),
    description: z.string().optional(),
  }),
  userIds: z.array(z.string().uuid()).optional(),
  manageUserIds: z.array(z.string().uuid()).optional(),
  projectIds: z.array(z.string().uuid()).optional(),
});

export class CreateUserGroupDto extends zodDto(zod) {}

// ================ Response ================

class CreateUserGroupResponseDataUserGroupRelationsUsers
  implements IDomainData
{
  @ApiProperty({ type: () => UserResponse })
  attributes: UserResponse;
}

class CreateUserGroupResponseDataUserGroupRelationsManageUsers
  implements IDomainData
{
  @ApiProperty({ type: () => UserResponse })
  attributes: UserResponse;
}

class CreateUserGroupResponseDataUserGroupRelationsProjects
  implements IDomainData
{
  @ApiProperty({ type: () => ProjectResponse })
  attributes: ProjectResponse;
}

class CreateUserGroupResponseDataUserGroupRelations {
  @ApiProperty({
    type: () => CreateUserGroupResponseDataUserGroupRelationsUsers,
    isArray: true,
  })
  users: CreateUserGroupResponseDataUserGroupRelationsUsers[];

  @ApiProperty({
    type: () => CreateUserGroupResponseDataUserGroupRelationsManageUsers,
    isArray: true,
  })
  manageUsers: CreateUserGroupResponseDataUserGroupRelationsManageUsers[];

  @ApiProperty({
    type: () => CreateUserGroupResponseDataUserGroupRelationsProjects,
    isArray: true,
  })
  projects: CreateUserGroupResponseDataUserGroupRelationsProjects[];
}

export class CreateUserGroupResponseDataUserGroup implements IDomainData {
  @ApiProperty({ type: () => UserGroupResponse })
  attributes: UserGroupResponse;

  @ApiProperty({ type: () => CreateUserGroupResponseDataUserGroupRelations })
  relations?: CreateUserGroupResponseDataUserGroupRelations;
}

export class CreateUserGroupResponseData {
  @ApiProperty({ type: () => CreateUserGroupResponseDataUserGroup })
  userGroup: CreateUserGroupResponseDataUserGroup;
}

export class CreateUserGroupResponse extends StandardResponse {
  @ApiProperty({ type: () => CreateUserGroupResponseData })
  data: CreateUserGroupResponseData;
}

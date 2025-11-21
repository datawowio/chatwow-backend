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
  userGroup: z
    .object({
      groupName: z.string().optional(),
      description: z.string().optional(),
    })
    .optional(),
  userIds: z.array(z.string().uuid()).optional(),
  projectIds: z.array(z.string().uuid()).optional(),
});

export class EditUserGroupDto extends zodDto(zod) {}

// ================ Response ================

class EditUserGroupResponseDataUserGroupRelationsUsers implements IDomainData {
  @ApiProperty({ type: () => UserResponse })
  attributes: UserResponse;
}

class EditUserGroupResponseDataUserGroupRelationsProjects
  implements IDomainData
{
  @ApiProperty({ type: () => ProjectResponse })
  attributes: ProjectResponse;
}

class EditUserGroupResponseDataUserGroupRelations {
  @ApiProperty({
    type: () => EditUserGroupResponseDataUserGroupRelationsUsers,
    isArray: true,
  })
  users?: EditUserGroupResponseDataUserGroupRelationsUsers[];

  @ApiProperty({
    type: () => EditUserGroupResponseDataUserGroupRelationsProjects,
    isArray: true,
  })
  projects?: EditUserGroupResponseDataUserGroupRelationsProjects[];
}

export class EditUserGroupResponseDataUserGroup implements IDomainData {
  @ApiProperty({ type: () => UserGroupResponse })
  attributes: UserGroupResponse;

  @ApiProperty({ type: () => EditUserGroupResponseDataUserGroupRelations })
  relations?: EditUserGroupResponseDataUserGroupRelations;
}

export class EditUserGroupResponseData {
  @ApiProperty({ type: () => EditUserGroupResponseDataUserGroup })
  userGroup: EditUserGroupResponseDataUserGroup;
}

export class EditUserGroupResponse extends StandardResponse {
  @ApiProperty({ type: () => EditUserGroupResponseData })
  data: EditUserGroupResponseData;
}

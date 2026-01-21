import { UserGroupResponse } from '@domain/base/user-group/user-group.response';
import { USER_ROLE, USER_STATUS } from '@domain/base/user/user.constant';
import { UserResponse } from '@domain/base/user/user.response';
import { ApiProperty } from '@nestjs/swagger';
import z from 'zod';

import type { IDomainData } from '@shared/common/common.type';
import { StandardResponse } from '@shared/http/http.response.dto';
import { zodDto } from '@shared/zod/zod.util';

// ==================== Request ====================

const zod = z.object({
  user: z
    .object({
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      role: z.enum(USER_ROLE).optional(),
      userStatus: z.enum(USER_STATUS).optional(),
      departmentId: z.string().uuid().optional(),
    })
    .optional(),
  userGroupIds: z.array(z.string().uuid()).optional(),
  manageProjectIds: z.array(z.string().uuid()).optional(),
});

export class EditUserDto extends zodDto(zod) {}

// ==================== Response ====================

class EditUserGroupData implements IDomainData {
  @ApiProperty({ type: () => UserGroupResponse })
  attributes: UserGroupResponse;
}

class EditUserRelations {
  @ApiProperty({ type: () => EditUserGroupData, isArray: true })
  userGroups?: EditUserGroupData[];
}

class EditUserUserData implements IDomainData {
  @ApiProperty({ type: () => UserResponse })
  attributes: UserResponse;

  @ApiProperty({ type: () => EditUserRelations })
  relations: EditUserRelations;
}

class EditUserData {
  @ApiProperty({ type: () => EditUserUserData })
  user: EditUserUserData;
}

export class EditUserResponse extends StandardResponse {
  @ApiProperty({ type: () => EditUserData })
  data: EditUserData;
}

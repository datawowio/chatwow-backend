import { UserGroupResponse } from '@domain/base/user-group/user-group.response';
import { USER_ROLE } from '@domain/base/user/user.constant';
import { UserResponse } from '@domain/base/user/user.response';
import { ApiProperty } from '@nestjs/swagger';
import z from 'zod';

import type { IDomainData } from '@shared/common/common.type';
import { StandardResponse } from '@shared/http/http.response.dto';
import { zodDto } from '@shared/zod/zod.util';

// ==================== Request ====================

const zod = z.object({
  user: z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    role: z.enum(USER_ROLE),
  }),
  userGroupIds: z.array(z.string().uuid()).optional(),
});

export class AddUserDto extends zodDto(zod) {}

// ==================== Response ====================

class AddUserGroupData implements IDomainData {
  @ApiProperty({ type: () => UserGroupResponse })
  attributes: UserGroupResponse;
}

class AddUserRelations {
  @ApiProperty({ type: () => AddUserGroupData, isArray: true })
  userGroups: AddUserGroupData[];
}

class AddUserUserData implements IDomainData {
  @ApiProperty({ type: () => UserResponse })
  attributes: UserResponse;

  @ApiProperty({ type: () => AddUserRelations })
  relations: AddUserRelations;
}

class AddUserData {
  @ApiProperty({ type: () => AddUserUserData })
  user: AddUserUserData;
}

export class AddUserResponse extends StandardResponse {
  @ApiProperty({ type: () => AddUserData })
  data: AddUserData;
}

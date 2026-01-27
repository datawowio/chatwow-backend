import { LineAccountResponse } from '@domain/base/line-account/line-account.response';
import { ProjectResponse } from '@domain/base/project/project.response';
import { UserGroupResponse } from '@domain/base/user-group/user-group.response';
import { UserResponse } from '@domain/base/user/user.response';
import { ApiProperty } from '@nestjs/swagger';
import z from 'zod';

import { IDomainData } from '@shared/common/common.type';
import {
  PaginationMetaResponse,
  StandardResponse,
} from '@shared/http/http.response.dto';
import { zodDto } from '@shared/zod/zod.util';

import { usersV1IncludesZod } from '../users.v1.util';

// ================ Request ================

const zod = z.object({
  includes: usersV1IncludesZod,
});

export class GetUserDto extends zodDto(zod) {}

// ================ Response ================

export class GetUserDataUsersRelationsUserGroups implements IDomainData {
  @ApiProperty({ type: () => UserGroupResponse })
  attributes: UserGroupResponse;
}

export class GetUserDataUsersRelationsManageProjects implements IDomainData {
  @ApiProperty({ type: () => ProjectResponse })
  attributes: ProjectResponse;
}

export class GetUserDataUsersRelationsLineAccounts implements IDomainData {
  @ApiProperty({ type: () => LineAccountResponse })
  attributes: LineAccountResponse;
}

export class GetUserDataUsersRelationsCreatedBy implements IDomainData {
  @ApiProperty({ type: () => UserResponse })
  attributes: UserResponse;
}

export class GetUserDataUsersRelationsUpdatedBy implements IDomainData {
  @ApiProperty({ type: () => UserResponse })
  attributes: UserResponse;
}

export class GetUserDataUsersRelations {
  @ApiProperty({
    type: () => GetUserDataUsersRelationsManageProjects,
    isArray: true,
  })
  manageProjects?: GetUserDataUsersRelationsManageProjects[];

  @ApiProperty({
    type: () => GetUserDataUsersRelationsUserGroups,
    isArray: true,
  })
  userGroups?: GetUserDataUsersRelationsUserGroups[];

  @ApiProperty({
    type: () => GetUserDataUsersRelationsLineAccounts,
  })
  lineAccount?: GetUserDataUsersRelationsLineAccounts;

  @ApiProperty({
    type: () => GetUserDataUsersRelationsCreatedBy,
  })
  createdBy?: GetUserDataUsersRelationsCreatedBy;

  @ApiProperty({
    type: () => GetUserDataUsersRelationsUpdatedBy,
  })
  updatedBy?: GetUserDataUsersRelationsUpdatedBy;
}

export class GetUserDataUser implements IDomainData {
  @ApiProperty({ type: () => UserResponse })
  attributes: UserResponse;

  @ApiProperty({ type: () => GetUserDataUsersRelations })
  relations?: GetUserDataUsersRelations;
}

export class GetUserData {
  @ApiProperty({ type: () => GetUserDataUser })
  user: GetUserDataUser;
}

export class GetUserResponse extends StandardResponse {
  @ApiProperty({ type: () => GetUserData })
  data: GetUserData;

  @ApiProperty({ type: () => PaginationMetaResponse })
  meta?: PaginationMetaResponse;
}

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

import { getProfileIncludesZod } from './get-profile.util';

// ================ Request ================

const zod = z.object({
  includes: getProfileIncludesZod,
});

export class GetProfileDto extends zodDto(zod) {}

// ================ Response ================

export class GetProfileDataUsersRelationsUserGroups implements IDomainData {
  @ApiProperty({ type: () => UserGroupResponse })
  attributes: UserGroupResponse;
}

export class GetProfileDataUsersRelationsManageProjects implements IDomainData {
  @ApiProperty({ type: () => ProjectResponse })
  attributes: ProjectResponse;
}

export class GetProfileDataUsersRelationsLineAccounts implements IDomainData {
  @ApiProperty({ type: () => LineAccountResponse })
  attributes: LineAccountResponse;
}

export class GetProfileDataUsersRelationsCreatedBy implements IDomainData {
  @ApiProperty({ type: () => UserResponse })
  attributes: UserResponse;
}

export class GetProfileDataUsersRelationsUpdatedBy implements IDomainData {
  @ApiProperty({ type: () => UserResponse })
  attributes: UserResponse;
}

export class GetProfileDataUsersRelations {
  @ApiProperty({
    type: () => GetProfileDataUsersRelationsManageProjects,
    isArray: true,
  })
  manageProjects?: GetProfileDataUsersRelationsManageProjects[];

  @ApiProperty({
    type: () => GetProfileDataUsersRelationsUserGroups,
    isArray: true,
  })
  userGroups?: GetProfileDataUsersRelationsUserGroups[];

  @ApiProperty({
    type: () => GetProfileDataUsersRelationsLineAccounts,
  })
  lineAccount?: GetProfileDataUsersRelationsLineAccounts;

  @ApiProperty({
    type: () => GetProfileDataUsersRelationsCreatedBy,
  })
  createdBy?: GetProfileDataUsersRelationsCreatedBy;

  @ApiProperty({
    type: () => GetProfileDataUsersRelationsUpdatedBy,
  })
  updatedBy?: GetProfileDataUsersRelationsUpdatedBy;
}

export class GetProfileDataUser implements IDomainData {
  @ApiProperty({ type: () => UserResponse })
  attributes: UserResponse;

  @ApiProperty({ type: () => GetProfileDataUsersRelations })
  relations?: GetProfileDataUsersRelations;
}

export class GetProfileData {
  @ApiProperty({ type: () => GetProfileDataUser })
  user: GetProfileDataUser;
}

export class GetProfileResponse extends StandardResponse {
  @ApiProperty({ type: () => GetProfileData })
  data: GetProfileData;

  @ApiProperty({ type: () => PaginationMetaResponse })
  meta?: PaginationMetaResponse;
}

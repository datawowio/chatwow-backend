import { LineAccountResponse } from '@domain/base/line-account/line-account.response';
import { ProjectResponse } from '@domain/base/project/project.response';
import { UserGroupResponse } from '@domain/base/user-group/user-group.response';
import { UserResponse } from '@domain/base/user/user.response';
import { userFilterZod, userSortZod } from '@domain/base/user/user.zod';
import { ApiProperty } from '@nestjs/swagger';
import z from 'zod';

import { IDomainData } from '@shared/common/common.type';
import {
  PaginationMetaResponse,
  StandardResponse,
} from '@shared/http/http.response.dto';
import { paginationZod, zodDto } from '@shared/zod/zod.util';

import { usersV1IncludesZod } from '../users.v1.util';

// ================ Request ================

const zod = z.object({
  includes: usersV1IncludesZod,
  sort: userSortZod,
  filter: userFilterZod,
  countFilter: userFilterZod,
  pagination: paginationZod,
});

export class ListUsersDto extends zodDto(zod) {}

// ================ Response ================

export class ListUsersDataUsersRelationsUserGroups implements IDomainData {
  @ApiProperty({ type: () => UserGroupResponse })
  attributes: UserGroupResponse;
}

export class ListUsersDataUsersRelationsManageProjects implements IDomainData {
  @ApiProperty({ type: () => ProjectResponse })
  attributes: ProjectResponse;
}

export class ListUsersDataUsersRelationsLineAccounts implements IDomainData {
  @ApiProperty({ type: () => LineAccountResponse })
  attributes: LineAccountResponse;
}

export class ListUsersDataUsersRelations {
  @ApiProperty({
    type: () => ListUsersDataUsersRelationsManageProjects,
    isArray: true,
  })
  manageProjects?: ListUsersDataUsersRelationsManageProjects[];

  @ApiProperty({
    type: () => ListUsersDataUsersRelationsUserGroups,
    isArray: true,
  })
  userGroups?: ListUsersDataUsersRelationsUserGroups[];

  @ApiProperty({
    type: () => ListUsersDataUsersRelationsLineAccounts,
  })
  lineAccount?: ListUsersDataUsersRelationsLineAccounts;
}

export class ListUsersDataUser implements IDomainData {
  @ApiProperty({ type: () => UserResponse })
  attributes: UserResponse;

  @ApiProperty({ type: () => ListUsersDataUsersRelations })
  relations?: ListUsersDataUsersRelations;
}

export class ListUsersData {
  @ApiProperty({ type: () => ListUsersDataUser, isArray: true })
  users: ListUsersDataUser[];
}

export class ListUsersResponse extends StandardResponse {
  @ApiProperty({ type: () => ListUsersData })
  data: ListUsersData;

  @ApiProperty({ type: () => PaginationMetaResponse })
  meta?: PaginationMetaResponse;
}

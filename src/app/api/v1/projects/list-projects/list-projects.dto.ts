import { ProjectDocumentResponse } from '@domain/base/project-document/project-document.response';
import { ProjectResponse } from '@domain/base/project/project.response';
import {
  projectFilterZod,
  projectSortZod,
} from '@domain/base/project/project.zod';
import { UserGroupResponse } from '@domain/base/user-group/user-group.response';
import { UserResponse } from '@domain/base/user/user.response';
import { ApiProperty } from '@nestjs/swagger';
import z from 'zod';

import type { IDomainData } from '@shared/common/common.type';
import {
  PaginationMetaResponse,
  StandardResponse,
} from '@shared/http/http.response.dto';
import { paginationZod, zodDto } from '@shared/zod/zod.util';

import { projectsV1IncludesZod } from '../projects.v1.util';

// ================ Request ================

const zod = z.object({
  includes: projectsV1IncludesZod,
  sort: projectSortZod,
  filter: projectFilterZod,
  pagination: paginationZod,
});

export class ListProjectsDto extends zodDto(zod) {}

// ================ Response ================

export class ListProjectsProjectsUserGroups implements IDomainData {
  @ApiProperty({ type: () => UserGroupResponse })
  attributes: UserGroupResponse;
}

export class ListProjectsProjectsManageUsers implements IDomainData {
  @ApiProperty({ type: () => UserResponse })
  attributes: UserResponse;
}

export class ListProjectsProjectsProjectDocuments implements IDomainData {
  @ApiProperty({ type: () => ProjectDocumentResponse })
  attributes: ProjectDocumentResponse;
}

export class ListProjectsProjectsRelations {
  @ApiProperty({
    type: () => ListProjectsProjectsProjectDocuments,
    isArray: true,
  })
  projectDocuments?: ListProjectsProjectsProjectDocuments[];

  @ApiProperty({
    type: () => ListProjectsProjectsUserGroups,
    isArray: true,
  })
  userGroups?: ListProjectsProjectsUserGroups[];

  @ApiProperty({
    type: () => ListProjectsProjectsManageUsers,
    isArray: true,
  })
  manageUsers?: ListProjectsProjectsManageUsers[];
}

export class ListProjectsProjectsData implements IDomainData {
  @ApiProperty({ type: () => ProjectResponse })
  attributes: ProjectResponse;

  @ApiProperty({ type: () => ListProjectsProjectsRelations })
  relations: ListProjectsProjectsRelations;
}

export class ListProjectsData {
  @ApiProperty({ type: () => ListProjectsProjectsData, isArray: true })
  projects: ListProjectsProjectsData[];
}

export class ListProjectsResponse extends StandardResponse {
  @ApiProperty({ type: () => ListProjectsData })
  data: ListProjectsData;

  @ApiProperty({ type: () => PaginationMetaResponse })
  meta: PaginationMetaResponse;
}

import { ProjectDocumentResponse } from '@domain/base/project-document/project-document.response';
import { ProjectResponse } from '@domain/base/project/project.response';
import {
  projectFilterZod,
  projectSortZod,
} from '@domain/base/project/project.zod';
import { StoredFileResponse } from '@domain/base/stored-file/stored-file.response';
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
  countFilter: projectFilterZod,
  pagination: paginationZod,
});

export class ListProjectsDto extends zodDto(zod) {}

// ================ Response ================

export class ListProjectsProjectsDocumentsRelationsCreatedBy
  implements IDomainData
{
  @ApiProperty({ type: () => UserResponse })
  attributes: UserResponse;
}

export class ListProjectsProjectsDocumentsRelationsUpdatedBy
  implements IDomainData
{
  @ApiProperty({ type: () => UserResponse })
  attributes: UserResponse;
}

export class ListProjectsProjectsUserGroups implements IDomainData {
  @ApiProperty({ type: () => UserGroupResponse })
  attributes: UserGroupResponse;
}

export class ListProjectsProjectsManageUsers implements IDomainData {
  @ApiProperty({ type: () => UserResponse })
  attributes: UserResponse;
}

export class ListProjectsProjectProjectDocumentsRelationsCreatedBy
  implements IDomainData
{
  @ApiProperty({ type: () => UserResponse })
  attributes: UserResponse;
}

export class ListProjectsProjectProjectDocumentsRelationsUpdatedBy
  implements IDomainData
{
  @ApiProperty({ type: () => UserResponse })
  attributes: UserResponse;
}

export class ListProjectsProjectsDocumentsRelationsStoredFile
  implements IDomainData
{
  @ApiProperty({ type: () => StoredFileResponse })
  attributes: StoredFileResponse;
}

export class ListProjectsProjectsDocumentsRelations {
  @ApiProperty({
    type: () => ListProjectsProjectsDocumentsRelationsStoredFile,
  })
  storedFile?: ListProjectsProjectsDocumentsRelationsStoredFile;

  @ApiProperty({
    type: () => ListProjectsProjectProjectDocumentsRelationsCreatedBy,
  })
  createdBy?: ListProjectsProjectProjectDocumentsRelationsCreatedBy;

  @ApiProperty({
    type: () => ListProjectsProjectProjectDocumentsRelationsUpdatedBy,
  })
  updatedBy?: ListProjectsProjectProjectDocumentsRelationsUpdatedBy;
}

export class ListProjectsProjectsProjectDocuments implements IDomainData {
  @ApiProperty({ type: () => ProjectDocumentResponse })
  attributes: ProjectDocumentResponse;

  @ApiProperty({ type: () => ListProjectsProjectsDocumentsRelations })
  relations?: ListProjectsProjectsDocumentsRelations;
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

  @ApiProperty({
    type: () => ListProjectsProjectsDocumentsRelationsCreatedBy,
  })
  createdBy?: ListProjectsProjectsDocumentsRelationsCreatedBy;

  @ApiProperty({
    type: () => ListProjectsProjectsDocumentsRelationsUpdatedBy,
  })
  updatedBy?: ListProjectsProjectsDocumentsRelationsUpdatedBy;
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

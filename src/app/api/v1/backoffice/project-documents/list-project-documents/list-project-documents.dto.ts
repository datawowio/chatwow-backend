import { ProjectDocumentResponse } from '@domain/base/project-document/project-document.response';
import {
  projectDocumentFilterZod,
  projectDocumentSortZod,
} from '@domain/base/project-document/project-document.zod';
import { ProjectResponse } from '@domain/base/project/project.response';
import { StoredFileResponse } from '@domain/base/stored-file/stored-file.response';
import { UserResponse } from '@domain/base/user/user.response';
import { ApiProperty } from '@nestjs/swagger';
import z from 'zod';

import type { IDomainData } from '@shared/common/common.type';
import {
  PaginationMetaResponse,
  StandardResponse,
} from '@shared/http/http.response.dto';
import { paginationZod, zodDto } from '@shared/zod/zod.util';

import { projectDocumentsV1IncludesZod } from '../project-documents.v1.util';

// ================ Request ================

const zod = z.object({
  includes: projectDocumentsV1IncludesZod,
  sort: projectDocumentSortZod,
  filter: projectDocumentFilterZod,
  countFilter: projectDocumentFilterZod,
  pagination: paginationZod,
});

export class ListProjectDocumentsDto extends zodDto(zod) {}

// ================ Response ================

export class ListProjectDocumentsProjectsDocumentsRelationsStoredFile
  implements IDomainData
{
  @ApiProperty({ type: () => StoredFileResponse })
  attributes: StoredFileResponse;
}

export class ListProjectDocumentsProjectsRelationsProject
  implements IDomainData
{
  @ApiProperty({ type: () => ProjectResponse })
  attributes: ProjectResponse;
}

export class ListProjectDocumentsProjectsRelationsCreatedBy
  implements IDomainData
{
  @ApiProperty({ type: () => UserResponse })
  attributes: UserResponse;
}

export class ListProjectDocumentsProjectsRelationsUpdatedBy
  implements IDomainData
{
  @ApiProperty({ type: () => UserResponse })
  attributes: UserResponse;
}

export class ListProjectDocumentsProjectsRelations {
  @ApiProperty({
    type: () => ListProjectDocumentsProjectsRelationsProject,
  })
  project?: ListProjectDocumentsProjectsRelationsProject;

  @ApiProperty({
    type: () => ListProjectDocumentsProjectsDocumentsRelationsStoredFile,
  })
  storedFile?: ListProjectDocumentsProjectsDocumentsRelationsStoredFile;

  @ApiProperty({
    type: () => ListProjectDocumentsProjectsRelationsCreatedBy,
  })
  createdBy?: ListProjectDocumentsProjectsRelationsCreatedBy;

  @ApiProperty({
    type: () => ListProjectDocumentsProjectsRelationsUpdatedBy,
  })
  updatedBy?: ListProjectDocumentsProjectsRelationsUpdatedBy;
}

export class ListProjectDocumentsProjectsData implements IDomainData {
  @ApiProperty({ type: () => ProjectDocumentResponse })
  attributes: ProjectDocumentResponse;

  @ApiProperty({ type: () => ListProjectDocumentsProjectsRelations })
  relations: ListProjectDocumentsProjectsRelations;
}

export class ListProjectDocumentsData {
  @ApiProperty({ type: () => ListProjectDocumentsProjectsData, isArray: true })
  projectDocuments: ListProjectDocumentsProjectsData[];
}

export class ListProjectDocumentsResponse extends StandardResponse {
  @ApiProperty({ type: () => ListProjectDocumentsData })
  data: ListProjectDocumentsData;

  @ApiProperty({ type: () => PaginationMetaResponse })
  meta: PaginationMetaResponse;
}

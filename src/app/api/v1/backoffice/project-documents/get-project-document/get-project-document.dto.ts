import { ProjectDocumentResponse } from '@domain/base/project-document/project-document.response';
import { ProjectResponse } from '@domain/base/project/project.response';
import { StoredFileResponse } from '@domain/base/stored-file/stored-file.response';
import { UserResponse } from '@domain/base/user/user.response';
import { ApiProperty } from '@nestjs/swagger';
import z from 'zod';

import type { IDomainData } from '@shared/common/common.type';
import { StandardResponse } from '@shared/http/http.response.dto';
import { zodDto } from '@shared/zod/zod.util';

import { projectDocumentsV1IncludesZod } from '../project-documents.v1.util';

// ================ Request ================

const zod = z.object({
  includes: projectDocumentsV1IncludesZod,
});

export class GetProjectDocumentDto extends zodDto(zod) {}

// ================ Response ================

export class GetProjectDocumentProjectsDocumentsRelationsStoredFile
  implements IDomainData
{
  @ApiProperty({ type: () => StoredFileResponse })
  attributes: StoredFileResponse;
}

export class GetProjectDocumentProjectsRelationsProject implements IDomainData {
  @ApiProperty({ type: () => ProjectResponse })
  attributes: ProjectResponse;
}

export class GetProjectDocumentsProjectsRelationsCreatedBy
  implements IDomainData
{
  @ApiProperty({ type: () => UserResponse })
  attributes: UserResponse;
}

export class GetProjectDocumentsProjectsRelationsUpdatedBy
  implements IDomainData
{
  @ApiProperty({ type: () => UserResponse })
  attributes: UserResponse;
}

export class GetProjectDocumentProjectsRelations {
  @ApiProperty({
    type: () => GetProjectDocumentProjectsRelationsProject,
  })
  project?: GetProjectDocumentProjectsRelationsProject;

  @ApiProperty({
    type: () => GetProjectDocumentProjectsDocumentsRelationsStoredFile,
  })
  storedFile?: GetProjectDocumentProjectsDocumentsRelationsStoredFile;

  @ApiProperty({
    type: () => GetProjectDocumentsProjectsRelationsCreatedBy,
  })
  createdBy?: GetProjectDocumentsProjectsRelationsCreatedBy;

  @ApiProperty({
    type: () => GetProjectDocumentsProjectsRelationsUpdatedBy,
  })
  updatedBy?: GetProjectDocumentsProjectsRelationsUpdatedBy;
}

export class GetProjectDocumentProjectsData implements IDomainData {
  @ApiProperty({ type: () => ProjectDocumentResponse })
  attributes: ProjectDocumentResponse;

  @ApiProperty({ type: () => GetProjectDocumentProjectsRelations })
  relations: GetProjectDocumentProjectsRelations;
}

export class GetProjectDocumentData {
  @ApiProperty({ type: () => GetProjectDocumentProjectsData })
  projectDocument: GetProjectDocumentProjectsData;
}

export class GetProjectDocumentResponse extends StandardResponse {
  @ApiProperty({ type: () => GetProjectDocumentData })
  data: GetProjectDocumentData;
}

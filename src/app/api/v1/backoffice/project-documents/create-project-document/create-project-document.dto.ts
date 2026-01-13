import { PROJECT_DOCUMENT_STATUS } from '@domain/base/project-document/project-document.constant';
import { ProjectDocumentResponse } from '@domain/base/project-document/project-document.response';
import { ProjectResponse } from '@domain/base/project/project.response';
import { StoredFileResponse } from '@domain/base/stored-file/stored-file.response';
import { storedFileZod } from '@domain/base/stored-file/stored-file.zod';
import { ApiProperty } from '@nestjs/swagger';
import z from 'zod';

import { IDomainData } from '@shared/common/common.type';
import { StandardResponse } from '@shared/http/http.response.dto';
import { zodDto } from '@shared/zod/zod.util';

// ================ Request ================

const zod = z.object({
  projectDocument: z.object({
    projectId: z.string().uuid(),
    documentStatus: z.enum(PROJECT_DOCUMENT_STATUS).optional(),
    documentDetails: z.string().optional(),
    aiSummaryMd: z.string().optional(),
  }),
  storedFile: storedFileZod,
});

export class CreateProjectDocumentDto extends zodDto(zod) {}

// ================ Response ================

class CreateProjectDocumentDataProjectDocumentRelationsProject
  implements IDomainData
{
  @ApiProperty({ type: () => ProjectResponse })
  attributes: ProjectResponse;
}

class CreateProjectDocumentDataProjectDocumentRelationsStoredFile
  implements IDomainData
{
  @ApiProperty({ type: () => StoredFileResponse })
  attributes: StoredFileResponse;
}

class CreateProjectDocumentDataProjectDocumentRelations {
  @ApiProperty({
    type: () => CreateProjectDocumentDataProjectDocumentRelationsProject,
  })
  project: CreateProjectDocumentDataProjectDocumentRelationsProject;

  @ApiProperty({
    type: () => CreateProjectDocumentDataProjectDocumentRelationsStoredFile,
  })
  storedFile: CreateProjectDocumentDataProjectDocumentRelationsStoredFile;
}

class CreateProjectDocumentDataProjectDocument implements IDomainData {
  @ApiProperty({ type: () => ProjectDocumentResponse })
  attributes: ProjectDocumentResponse;

  @ApiProperty({
    type: () => CreateProjectDocumentDataProjectDocumentRelations,
  })
  relations: CreateProjectDocumentDataProjectDocumentRelations;
}

class CreateProjectDocumentData {
  @ApiProperty({ type: () => CreateProjectDocumentDataProjectDocument })
  projectDocument: CreateProjectDocumentDataProjectDocument;
}

export class CreateProjectDocumentResponse extends StandardResponse {
  @ApiProperty({ type: () => CreateProjectDocumentData })
  data: CreateProjectDocumentData;
}

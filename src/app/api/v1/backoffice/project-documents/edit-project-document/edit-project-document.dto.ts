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
  projectDocument: z
    .object({
      documentStatus: z.enum(PROJECT_DOCUMENT_STATUS).optional(),
      documentDetails: z.string().optional(),
      aiSummaryMd: z.string().optional(),
    })
    .optional(),
  storedFile: storedFileZod.optional(),
});

export class EditProjectDocumentDto extends zodDto(zod) {}

// ================ Response ================

class EditProjectDocumentDataProjectDocumentRelationsProject
  implements IDomainData
{
  @ApiProperty({ type: () => ProjectResponse })
  attributes: ProjectResponse;
}

class EditProjectDocumentDataProjectDocumentRelationsStoredFile
  implements IDomainData
{
  @ApiProperty({ type: () => StoredFileResponse })
  attributes: StoredFileResponse;
}

class EditProjectDocumentDataProjectDocumentRelations {
  @ApiProperty({
    type: () => EditProjectDocumentDataProjectDocumentRelationsProject,
  })
  project: EditProjectDocumentDataProjectDocumentRelationsProject;

  @ApiProperty({
    type: () => EditProjectDocumentDataProjectDocumentRelationsStoredFile,
  })
  storedFile?: EditProjectDocumentDataProjectDocumentRelationsStoredFile;
}

class EditProjectDocumentDataProjectDocument implements IDomainData {
  @ApiProperty({ type: () => ProjectDocumentResponse })
  attributes: ProjectDocumentResponse;

  @ApiProperty({
    type: () => EditProjectDocumentDataProjectDocumentRelations,
  })
  relations: EditProjectDocumentDataProjectDocumentRelations;
}

class EditProjectDocumentData {
  @ApiProperty({ type: () => EditProjectDocumentDataProjectDocument })
  projectDocument: EditProjectDocumentDataProjectDocument;
}

export class EditProjectDocumentResponse extends StandardResponse {
  @ApiProperty({ type: () => EditProjectDocumentData })
  data: EditProjectDocumentData;
}

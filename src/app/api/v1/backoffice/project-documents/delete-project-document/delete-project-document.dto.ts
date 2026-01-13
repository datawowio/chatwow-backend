import { ProjectDocumentResponse } from '@domain/base/project-document/project-document.response';
import { ProjectResponse } from '@domain/base/project/project.response';
import { ApiProperty } from '@nestjs/swagger';

import { IDomainData } from '@shared/common/common.type';
import { StandardResponse } from '@shared/http/http.response.dto';

// ================ Request ================

// ================ Response ================

class DeleteProjectDocumentDataProjectDocumentRelationsProject
  implements IDomainData
{
  @ApiProperty({ type: () => ProjectResponse })
  attributes: ProjectResponse;
}

class DeleteProjectDocumentDataProjectDocumentRelations {
  @ApiProperty({
    type: () => DeleteProjectDocumentDataProjectDocumentRelationsProject,
  })
  project: DeleteProjectDocumentDataProjectDocumentRelationsProject;
}

class DeleteProjectDocumentDataProjectDocument implements IDomainData {
  @ApiProperty({ type: () => ProjectDocumentResponse })
  attributes: ProjectDocumentResponse;

  @ApiProperty({
    type: () => DeleteProjectDocumentDataProjectDocumentRelations,
  })
  relations: DeleteProjectDocumentDataProjectDocumentRelations;
}

class DeleteProjectDocumentData {
  @ApiProperty({ type: () => DeleteProjectDocumentDataProjectDocument })
  projectDocument: DeleteProjectDocumentDataProjectDocument;
}

export class DeleteProjectDocumentResponse extends StandardResponse {
  @ApiProperty({ type: () => DeleteProjectDocumentData })
  data: DeleteProjectDocumentData;
}

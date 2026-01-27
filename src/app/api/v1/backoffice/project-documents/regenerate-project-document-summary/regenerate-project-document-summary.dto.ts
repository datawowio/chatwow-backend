import { ProjectDocumentResponse } from '@domain/base/project-document/project-document.response';
import { ApiProperty } from '@nestjs/swagger';

import { IDomainData } from '@shared/common/common.type';
import { StandardResponse } from '@shared/http/http.response.dto';

// ================ Request ================

// ================ Response ================

class RegenerateProjectDocumentSummaryDataProjectDocument
  implements IDomainData
{
  @ApiProperty({ type: () => ProjectDocumentResponse })
  attributes: ProjectDocumentResponse;
}

class RegenerateProjectDocumentSummaryData {
  @ApiProperty({
    type: () => RegenerateProjectDocumentSummaryDataProjectDocument,
  })
  projectDocument: RegenerateProjectDocumentSummaryDataProjectDocument;
}

export class RegenerateProjectDocumentSummaryResponse extends StandardResponse {
  @ApiProperty({ type: () => RegenerateProjectDocumentSummaryData })
  data: RegenerateProjectDocumentSummaryData;
}

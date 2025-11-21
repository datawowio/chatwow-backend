import { ApiProperty } from '@nestjs/swagger';

import { DATE_EXAMPLE } from '@shared/common/common.constant';

export class ProjectDocumentResponse {
  @ApiProperty({ example: '' })
  id: string;

  @ApiProperty({ example: 'ACTIVE' })
  documentStatus: 'ACTIVE' | 'INACTIVE';

  @ApiProperty({ example: DATE_EXAMPLE })
  createdAt: string;

  @ApiProperty({ example: DATE_EXAMPLE })
  updatedAt: string;

  @ApiProperty({ example: 'Detailed description of the document.' })
  documentDetails: string;

  @ApiProperty({ example: '# Summary' })
  aiSummaryMd: string;
}

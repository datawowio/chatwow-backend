import { ApiProperty } from '@nestjs/swagger';

export class ProjectDocumentResponse {
  @ApiProperty({ example: '' })
  id: string;

  @ApiProperty({ example: 'ACTIVE' })
  documentStatus: 'ACTIVE' | 'INACTIVE';

  @ApiProperty({ example: 'Detailed description of the document.' })
  documentDetails: string;

  @ApiProperty({ example: '# Summary' })
  aiSummaryMd: string;
}

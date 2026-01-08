import { ApiProperty } from '@nestjs/swagger';

import { DATE_EXAMPLE, UUID_EXAMPLE } from '@shared/common/common.constant';

export class StoredFileResponse {
  @ApiProperty({ example: UUID_EXAMPLE })
  id: string;

  @ApiProperty({ example: 'document.pdf' })
  filename: string;

  @ApiProperty({ example: 1024, nullable: true })
  filesizeByte: number;

  @ApiProperty({ example: 'https://presigned-url', nullable: true })
  presignUrl: string | null;

  @ApiProperty({ example: DATE_EXAMPLE, nullable: true })
  createdAt: string;

  @ApiProperty({ example: DATE_EXAMPLE, nullable: true })
  updatedAt: string;

  @ApiProperty({ example: 'application/pdf', nullable: true })
  mimeType: string;

  @ApiProperty({ example: 'pdf', nullable: true })
  extension: string;
}

export class PresignUploadResponse {
  @ApiProperty({ example: UUID_EXAMPLE })
  id: string;

  @ApiProperty({ example: 'https://presigned-upload-url' })
  presignUrl: string;
}

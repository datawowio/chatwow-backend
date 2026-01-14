import { ApiProperty } from '@nestjs/swagger';

import { DATE_EXAMPLE, UUID_EXAMPLE } from '@shared/common/common.constant';

export class ProjectChatLogResponse {
  @ApiProperty({ example: UUID_EXAMPLE })
  id: string;

  @ApiProperty({ example: DATE_EXAMPLE })
  createdAt: string;

  @ApiProperty({ example: 'message' })
  message: string;
}

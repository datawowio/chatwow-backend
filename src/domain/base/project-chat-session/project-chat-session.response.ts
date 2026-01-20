import { ApiProperty } from '@nestjs/swagger';

import { SessionStatus } from '@infra/db/db';

import { DATE_EXAMPLE, UUID_EXAMPLE } from '@shared/common/common.constant';

export class ProjectChatSessionResponse {
  @ApiProperty({ example: UUID_EXAMPLE })
  id: string;

  @ApiProperty({ example: DATE_EXAMPLE })
  createdAt: string;

  @ApiProperty({ example: 'ACTIVE' })
  sessionStatus: SessionStatus;
}

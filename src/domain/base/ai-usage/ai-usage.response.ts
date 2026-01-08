import { ApiProperty } from '@nestjs/swagger';

import { DATE_EXAMPLE, UUID_EXAMPLE } from '@shared/common/common.constant';

export class AiUsageResponse {
  @ApiProperty({ example: UUID_EXAMPLE })
  id: string;

  @ApiProperty({ example: UUID_EXAMPLE })
  projectId: string;

  @ApiProperty({ example: DATE_EXAMPLE })
  createdAt: string;

  @ApiProperty({ example: DATE_EXAMPLE })
  aiRequestAt: string | null;

  @ApiProperty({ example: DATE_EXAMPLE })
  aiReplyAt: string | null;

  @ApiProperty({ example: 0 })
  replyTimeMs: number | null;

  @ApiProperty({ example: 100 })
  tokenUsed: string;

  @ApiProperty({ example: 99 })
  confidence: number;

  @ApiProperty({ example: 'project_chat_logs' })
  refTable: string;

  @ApiProperty({ example: UUID_EXAMPLE })
  refId: string;
}

import { ApiProperty } from '@nestjs/swagger';

import type { AiModelName } from '@infra/db/db';

import { DATE_EXAMPLE, UUID_EXAMPLE } from '@shared/common/common.constant';

export class AiUsageTokenResponse {
  @ApiProperty({ example: UUID_EXAMPLE })
  id: string;

  @ApiProperty({ example: DATE_EXAMPLE })
  createdAt: string;

  @ApiProperty({ example: UUID_EXAMPLE })
  aiUsageId: string;

  @ApiProperty({ example: 'GPT_DW' satisfies AiModelName })
  aiModelName: AiModelName;

  @ApiProperty({ example: 1000 })
  inputTokens: number;

  @ApiProperty({ example: 500 })
  outputTokens: number;

  @ApiProperty({ example: 1500 })
  totalTokens: number;

  @ApiProperty({ example: 100 })
  cacheCreationInputTokens: number;

  @ApiProperty({ example: 200 })
  cacheReadInputTokens: number;

  @ApiProperty({ example: 0.0123456789 })
  totalPrice: number;

  @ApiProperty({ example: 0.0123456789 })
  initialTotalPrice: number;
}

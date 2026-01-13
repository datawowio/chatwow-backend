import { ApiProperty } from '@nestjs/swagger';

import { AiModelName } from '@infra/db/db';

import { DATE_EXAMPLE } from '@shared/common/common.constant';

export class AiModelResponse {
  @ApiProperty({ example: 'GPT_DW' })
  aiModel: AiModelName;

  @ApiProperty({ example: DATE_EXAMPLE })
  createdAt: string;

  @ApiProperty({ example: DATE_EXAMPLE })
  updatedAt: string;

  @ApiProperty({ example: 10.0 })
  pricePerToken: string;
}

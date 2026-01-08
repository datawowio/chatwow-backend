import { ApiProperty } from '@nestjs/swagger';
import { Json } from '@infra/db/db';

import { DATE_EXAMPLE, UUID_EXAMPLE } from '@shared/common/common.constant';

export class AppConfigurationResponse {
  @ApiProperty({ example: UUID_EXAMPLE })
  id: string;

  @ApiProperty({ example: DATE_EXAMPLE })
  createdAt: string;

  @ApiProperty({ example: DATE_EXAMPLE })
  updatedAt: string;

  @ApiProperty({ example: 'config_key' })
  configKey: string;

  @ApiProperty({ example: {} })
  configData: Json;
}

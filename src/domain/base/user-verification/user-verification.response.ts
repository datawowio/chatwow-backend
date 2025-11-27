import { ApiProperty } from '@nestjs/swagger';

import { DATE_EXAMPLE } from '@shared/common/common.constant';

export class UserVerificationResponse {
  @ApiProperty({ example: '' })
  id: string;

  @ApiProperty({ example: '' })
  createdAt: string;

  @ApiProperty({ example: '' })
  userId: string;

  @ApiProperty({ example: DATE_EXAMPLE })
  expireAt: string;

  @ApiProperty({ example: DATE_EXAMPLE })
  revokeAt: string | null;
}

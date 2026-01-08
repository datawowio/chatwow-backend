import { ApiProperty } from '@nestjs/swagger';

import { DATE_EXAMPLE, UUID_EXAMPLE } from '@shared/common/common.constant';

export class AiUsageUserGroupResponse {
  @ApiProperty({ example: UUID_EXAMPLE })
  id: string;

  @ApiProperty({ example: DATE_EXAMPLE })
  createdAt: string;

  @ApiProperty({ example: UUID_EXAMPLE, nullable: true })
  userGroupId: string | null;

  @ApiProperty({ example: 100.5 })
  tokenUsed: string;

  @ApiProperty({ example: 10 })
  chatCount: string;

  @ApiProperty({ example: UUID_EXAMPLE })
  aiUsageId: string;
}

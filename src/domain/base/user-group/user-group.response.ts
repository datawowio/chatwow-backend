import { ApiProperty } from '@nestjs/swagger';

import { DATE_EXAMPLE } from '@shared/common/common.constant';

export class UserGroupResponse {
  @ApiProperty({ example: '' })
  id: string;

  @ApiProperty({ example: 'Admin Group' })
  groupName: string;

  @ApiProperty({ example: 'Group for administrators' })
  description: string;

  @ApiProperty({ example: DATE_EXAMPLE })
  createdAt: string;

  @ApiProperty({ example: DATE_EXAMPLE })
  updatedAt: string;
}

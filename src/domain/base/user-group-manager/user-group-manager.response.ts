import { ApiProperty } from '@nestjs/swagger';

export class UserGroupManagerResponse {
  @ApiProperty({ example: '', nullable: true })
  userId: string | null;

  @ApiProperty({ example: '', nullable: true })
  userGroupId: string | null;
}

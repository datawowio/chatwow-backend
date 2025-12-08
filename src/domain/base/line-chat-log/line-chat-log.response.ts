import { ApiProperty } from '@nestjs/swagger';

import type { ChatSender } from '@infra/db/db';

import { DATE_EXAMPLE, UUID_EXAMPLE } from '@shared/common/common.constant';

export class LineChatLogResponse {
  @ApiProperty({ example: UUID_EXAMPLE })
  id: string;

  @ApiProperty({ example: 'test' })
  message: string;

  @ApiProperty({ example: DATE_EXAMPLE })
  createdAt: string;

  @ApiProperty({ example: 'USER' satisfies ChatSender })
  chatSender: ChatSender;
}

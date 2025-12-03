import { ApiProperty } from '@nestjs/swagger';

import { MessageStatus } from '@infra/db/db';

// import type { MessageStatus } from '@infra/db/db';

export class MessageTaskResponse {
  @ApiProperty({ example: '' })
  id: string;

  @ApiProperty({ example: '' })
  createdAt: string;

  @ApiProperty({ example: '' })
  updatedAt: string;

  @ApiProperty({ example: '' })
  expireAt: string;

  @ApiProperty({ example: 'email-queue' })
  queueName: string;

  @ApiProperty({ example: 'email-exchange', nullable: true })
  exchangeName: string | null;

  @ApiProperty({ example: { to: 'user@example.com', subject: 'Hello' } })
  payload: Record<string, any>;

  @ApiProperty({ example: 'SUCCESS' satisfies MessageStatus })
  messageStatus: MessageStatus;

  @ApiProperty({ example: 0 })
  attempts: number;

  @ApiProperty({ example: 5 })
  maxAttempts: number;

  @ApiProperty({ example: null, nullable: true })
  lastError: string | null;
}

import { Controller, Get, Query } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import {
  ChatSummaryDto,
  ChatSummaryResponse,
} from './chat-summary/chat-summary.dto';
import { ChatSummaryQuery } from './chat-summary/chat-summary.query';

@Controller({ path: 'analytics', version: '1' })
export class AnalyticsV1Controller {
  constructor(private chatSummaryQuery: ChatSummaryQuery) {}

  @Get('chat-summary')
  @ApiResponse({
    type: () => ChatSummaryResponse,
  })
  async chatSummary(
    //
    @Query() query: ChatSummaryDto,
  ) {
    return this.chatSummaryQuery.exec(query);
  }
}

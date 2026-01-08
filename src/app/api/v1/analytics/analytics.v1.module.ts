import { Module } from '@nestjs/common';

import { AnalyticsV1Controller } from './analytics.v1.controller';
import { ChatSummaryQuery } from './chat-summary/chat-summary.query';

@Module({
  providers: [ChatSummaryQuery],
  controllers: [AnalyticsV1Controller],
})
export class AnalyticsV1Module {}

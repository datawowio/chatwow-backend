import { Module } from '@nestjs/common';

import { AiUsageSummaryQuery } from './ai-usage-summary/ai-usage-summary.query';
import { AnalyticsV1Controller } from './analytics.v1.controller';

@Module({
  providers: [AiUsageSummaryQuery],
  controllers: [AnalyticsV1Controller],
})
export class AnalyticsV1Module {}

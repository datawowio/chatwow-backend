import { Get, Query } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import { BackOfficeController } from '@shared/common/common.decorator';

import {
  AiUsageSummaryDto,
  AiUsageSummaryResponse,
} from './ai-usage-summary/ai-usage-summary.dto';
import { AiUsageSummaryQuery } from './ai-usage-summary/ai-usage-summary.query';

@BackOfficeController({ path: 'analytics', version: '1' })
export class AnalyticsV1Controller {
  constructor(private chatSummaryQuery: AiUsageSummaryQuery) {}

  @Get('ai-usage')
  @ApiResponse({
    type: () => AiUsageSummaryResponse,
  })
  async AiUsageSummary(
    //
    @Query() query: AiUsageSummaryDto,
  ) {
    return this.chatSummaryQuery.exec(query);
  }
}

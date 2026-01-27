import { Module } from '@nestjs/common';

import { AiUsageTokenService } from './ai-usage-token.service';

@Module({
  providers: [AiUsageTokenService],
  exports: [AiUsageTokenService],
})
export class AiUsageTokenModule {}

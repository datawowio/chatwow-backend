import { Module } from '@nestjs/common';

import { AiPricingService } from './ai-pricing.service';

@Module({
  providers: [AiPricingService],
  exports: [AiPricingService],
})
export class AiPricingModule {}

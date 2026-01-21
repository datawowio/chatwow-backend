import { AiUsageTokenService } from '@domain/base/ai-usage-token/ai-usage-token.service';
import { AiUsageService } from '@domain/base/ai-usage/ai-usage.service';
import { AiPricingService } from '@domain/logic/ai-pricing/ai-pricing.service';
import { Injectable } from '@nestjs/common';

import { TransactionService } from '@infra/db/transaction/transaction.service';

import { ProcessAiUsageJobData } from './process-ai-usage.type';

@Injectable()
export class ProcessAiUsageCommand {
  constructor(
    private aiUsageService: AiUsageService,
    private aiUsageTokenService: AiUsageTokenService,
    private aiPricingService: AiPricingService,
    private transactionService: TransactionService,
  ) {}

  async exec(entity: ProcessAiUsageJobData) {
    await this.aiPricingService.setUsageTokenPrice(entity.aiUsageTokens);
    await this.save(entity);
  }

  async save(entity: ProcessAiUsageJobData) {
    await this.transactionService.transaction(async () => {
      await this.aiUsageService.save(entity.aiUsage);
      await this.aiUsageTokenService.saveBulk(entity.aiUsageTokens);
    });
  }
}

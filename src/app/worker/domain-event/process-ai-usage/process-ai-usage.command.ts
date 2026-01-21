import { AiUsage } from '@domain/base/ai-usage/ai-usage.domain';
import { AiUsageService } from '@domain/base/ai-usage/ai-usage.service';
import { Injectable } from '@nestjs/common';

import { MainDb } from '@infra/db/db.main';
import { TransactionService } from '@infra/db/transaction/transaction.service';

import { ProcessAiUsageJobData } from './process-ai-usage.type';

type Entity = {
  aiUsage: AiUsage;
};

@Injectable()
export class ProcessAiUsageCommand {
  constructor(
    private aiUsageService: AiUsageService,
    private transactionService: TransactionService,
    private db: MainDb,
  ) {}

  async exec(entity: ProcessAiUsageJobData) {
    await this.save(entity);
  }

  async save({ aiUsage }: Entity) {
    await this.transactionService.transaction(async () => {
      await this.aiUsageService.save(aiUsage);
    });
  }

  async processProject(aiUsage: AiUsage): Promise<Entity> {
    return {
      aiUsage,
    };
  }
}

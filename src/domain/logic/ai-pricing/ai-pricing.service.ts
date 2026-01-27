import { aiModelFromPg } from '@domain/base/ai-model/ai-model.mapper';
import { AiUsageToken } from '@domain/base/ai-usage-token/ai-usage-token.domain';
import { Injectable } from '@nestjs/common';

import { MainDb } from '@infra/db/db.main';

import { ModelCalculatorFunc } from './ai-pricing.type';
import { getAiCalculator } from './ai-pricing.util';

@Injectable()
export class AiPricingService {
  constructor(private db: MainDb) {}

  async setUsageTokenPrice(aiUsageToken: AiUsageToken[]) {
    if (!aiUsageToken.length) {
      return;
    }

    const aiModelPg = await this.db.read
      .selectFrom('ai_models')
      .selectAll()
      .where(
        'ai_model_name',
        'in',
        aiUsageToken.map((t) => t.aiModelName),
      )
      .execute();

    const calcMapper = new Map<string, ModelCalculatorFunc>();
    for (const model of aiModelPg) {
      const aiModel = aiModelFromPg(model);
      const modelName = aiModel.aiModelName;
      calcMapper.set(modelName, getAiCalculator(aiModel));
    }

    for (const usageToken of aiUsageToken) {
      const calculator = calcMapper.get(usageToken.aiModelName);
      if (!calculator) {
        throw new Error('unexpected: no model matching ai usage token');
      }

      const price = calculator(usageToken);
      usageToken.edit({
        price,
      });
    }
  }
}

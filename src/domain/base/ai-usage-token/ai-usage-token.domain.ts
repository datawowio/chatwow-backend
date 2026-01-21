import type { AiModelName } from '@infra/db/db';

import { DomainEntity } from '@shared/common/common.domain';
import { isDefined } from '@shared/common/common.validator';

import {
  aiUsageTokenFromPlain,
  aiUsageTokenToPlain,
} from './ai-usage-token.mapper';
import type {
  AiUsageTokenPg,
  AiUsageTokenPlain,
  AiUsageTokenUpdateData,
} from './ai-usage-token.type';

export class AiUsageToken extends DomainEntity<AiUsageTokenPg> {
  readonly id: string;
  readonly createdAt: Date;
  readonly aiUsageId: string;
  readonly aiModelName: AiModelName;
  readonly inputTokens: number;
  readonly outputTokens: number;
  readonly totalTokens: number;
  readonly cacheCreationInputTokens: number;
  readonly cacheReadInputTokens: number;
  readonly totalPrice: number;
  readonly initialTotalPrice: number;

  constructor(plain: AiUsageTokenPlain) {
    super();
    Object.assign(this, plain);
  }

  edit({ data }: AiUsageTokenUpdateData) {
    const plain: AiUsageTokenPlain = {
      id: this.id,
      createdAt: this.createdAt,
      aiUsageId: this.aiUsageId,
      aiModelName: this.aiModelName,
      inputTokens: isDefined(data.inputTokens)
        ? data.inputTokens
        : this.inputTokens,
      outputTokens: isDefined(data.outputTokens)
        ? data.outputTokens
        : this.outputTokens,
      totalTokens: isDefined(data.totalTokens)
        ? data.totalTokens
        : this.totalTokens,
      cacheCreationInputTokens: isDefined(data.cacheCreationInputTokens)
        ? data.cacheCreationInputTokens
        : this.cacheCreationInputTokens,
      cacheReadInputTokens: isDefined(data.cacheReadInputTokens)
        ? data.cacheReadInputTokens
        : this.cacheReadInputTokens,
      totalPrice: isDefined(data.totalPrice)
        ? data.totalPrice
        : this.totalPrice,
      initialTotalPrice: isDefined(data.initialTotalPrice)
        ? data.initialTotalPrice
        : this.initialTotalPrice,
    };

    Object.assign(this, plain);
  }

  clone() {
    return aiUsageTokenFromPlain(aiUsageTokenToPlain(this));
  }
}

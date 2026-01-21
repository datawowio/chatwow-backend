import Big from 'big.js';

import { DomainEntity } from '@shared/common/common.domain';
import { valueOr } from '@shared/common/common.func';

import { AiModelName } from '../ai-model/ai-model.type';
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
  readonly totalPrice: Big;
  readonly initialTotalPrice: Big;

  constructor(plain: AiUsageTokenPlain) {
    super();
    Object.assign(this, plain);
  }

  edit(data: AiUsageTokenUpdateData) {
    const plain: AiUsageTokenPlain = {
      id: this.id,
      createdAt: this.createdAt,
      aiUsageId: this.aiUsageId,
      aiModelName: this.aiModelName,
      inputTokens: this.inputTokens,
      outputTokens: this.outputTokens,
      totalTokens: this.totalTokens,
      cacheCreationInputTokens: this.cacheCreationInputTokens,
      cacheReadInputTokens: this.cacheReadInputTokens,

      //
      totalPrice: valueOr(data.price, this.totalPrice),
      initialTotalPrice: this.initialTotalPrice
        ? this.initialTotalPrice
        : valueOr(data.price, this.initialTotalPrice),
    };

    Object.assign(this, plain);
  }

  clone() {
    return aiUsageTokenFromPlain(aiUsageTokenToPlain(this));
  }
}

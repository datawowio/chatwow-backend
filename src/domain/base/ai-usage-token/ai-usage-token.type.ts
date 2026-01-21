import type { AiModelName, AiUsageTokens } from '@infra/db/db';
import type { DBModel } from '@infra/db/db.common';

import type { Plain, Serialized } from '@shared/common/common.type';

import type { AiUsageToken } from './ai-usage-token.domain';

export type AiUsageTokenPg = DBModel<AiUsageTokens>;
export type AiUsageTokenPlain = Plain<AiUsageToken>;

export type AiUsageTokenJson = Serialized<AiUsageTokenPlain>;

export type AiUsageTokenNewData = {
  data: {
    aiUsageId: string;
    aiModelName: AiModelName;
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
    cacheCreationInputTokens: number;
    cacheReadInputTokens: number;
    totalPrice: number;
    initialTotalPrice: number;
  };
};

export type AiUsageTokenUpdateData = {
  data: {
    inputTokens?: number;
    outputTokens?: number;
    totalTokens?: number;
    cacheCreationInputTokens?: number;
    cacheReadInputTokens?: number;
    totalPrice?: number;
    initialTotalPrice?: number;
  };
};

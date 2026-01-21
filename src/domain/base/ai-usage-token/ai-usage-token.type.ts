import Big from 'big.js';

import type { AiUsageTokens } from '@infra/db/db';
import type { DBModel } from '@infra/db/db.common';

import type {
  Plain,
  Serialized,
  WithPgState,
} from '@shared/common/common.type';

import { AiModelName } from '../ai-model/ai-model.type';
import type { AiUsageToken } from './ai-usage-token.domain';

export type AiUsageTokenPg = DBModel<AiUsageTokens>;
export type AiUsageTokenPlain = Plain<AiUsageToken>;

export type AiUsageTokenJson = Serialized<AiUsageTokenPlain>;
export type AiUsageTokenJsonState = WithPgState<
  AiUsageTokenJson,
  AiUsageTokenPg
>;

export type AiUsageTokenNewData = {
  aiUsageId: string;
  aiModelName: AiModelName;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  cacheCreationInputTokens: number;
  cacheReadInputTokens: number;
  totalPrice?: Big;
  initialTotalPrice?: Big;
};

export type AiUsageTokenUpdateData = {
  price?: Big;
};

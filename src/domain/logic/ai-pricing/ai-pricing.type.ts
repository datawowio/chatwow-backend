import type { AiUsageToken } from '@domain/base/ai-usage-token/ai-usage-token.domain';
import Big from 'big.js';

export type ModelCalculatorFunc = (aiUsageToken: AiUsageToken) => Big;

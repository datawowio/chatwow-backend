import { AiUsageToken } from '@domain/base/ai-usage-token/ai-usage-token.domain';
import { AiUsageTokenJsonState } from '@domain/base/ai-usage-token/ai-usage-token.type';
import { AiUsage } from '@domain/base/ai-usage/ai-usage.domain';
import { AiUsageJsonState } from '@domain/base/ai-usage/ai-usage.type';

import { JobInput } from '@app/worker/worker.type';

export type ProcessAiUsageJobData = {
  aiUsage: AiUsage;
  aiUsageTokens: AiUsageToken[];
};

export type ProcessAiUsageJobInput = JobInput<{
  aiUsage: AiUsageJsonState;
  aiUsageTokens: AiUsageTokenJsonState[];
}>;

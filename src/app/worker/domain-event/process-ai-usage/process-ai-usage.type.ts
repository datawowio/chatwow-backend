import { AiUsage } from '@domain/base/ai-usage/ai-usage.domain';
import { AiUsageJsonState } from '@domain/base/ai-usage/ai-usage.type';

import { JobInput } from '@app/worker/worker.type';

export type ProcessAiUsageJobData = {
  aiUsage: AiUsage;
};

export type ProcessAiUsageJobInput = JobInput<{
  aiUsage: AiUsageJsonState;
}>;

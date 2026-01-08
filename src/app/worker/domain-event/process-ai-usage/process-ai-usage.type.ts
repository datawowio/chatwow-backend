import { AiUsage } from '@domain/base/ai-usage/ai-usage.domain';
import { AiUsageJsonState } from '@domain/base/ai-usage/ai-usage.type';

import { JobInput } from '@app/worker/worker.type';

type Owner = 'userGroup' | 'project';
export type ProcessAiUsageJobData = {
  aiUsage: AiUsage;
  owner: Owner;
};

export type ProcessAiUsageJobInput = JobInput<{
  aiUsage: AiUsageJsonState;
  owner: Owner;
}>;

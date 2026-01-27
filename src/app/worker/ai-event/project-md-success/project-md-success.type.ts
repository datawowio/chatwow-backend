import { TokenUsage } from '@domain/logic/ai-api/ai-api.type';
import z from 'zod';

import { projectMdSuccessValidator } from '../ai-event.zod';

export type ProjectMdSuccessData = {
  projectId: string;
  aiUsageId: string;
  confidence: number;
  tokenUsage: TokenUsage[];
};

export type ProjectMdSuccessRawInput = z.infer<
  typeof projectMdSuccessValidator
>;

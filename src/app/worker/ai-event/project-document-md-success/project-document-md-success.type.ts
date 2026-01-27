import { TokenUsage } from '@domain/logic/ai-api/ai-api.type';
import z from 'zod';

import { projectDocumentMdSuccessValidator } from '../ai-event.zod';

export type ProjectDocumentMdSuccessData = {
  projectDocumentId: string;
  aiUsageId: string;
  confidence: number;
  tokenUsage: TokenUsage[];
};

export type ProjectDocumentMdSuccessRawInput = z.infer<
  typeof projectDocumentMdSuccessValidator
>;

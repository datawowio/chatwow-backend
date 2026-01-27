import z from 'zod';

import { projectDocumentMdSuccessValidator } from '../ai-event.zod';

export type ProjectDocumentMdSuccessData = {
  projectDocumentId: string;
  // aiUsageId: string;
  // confidence: number;
  // tokenUsage: TokenUsage[];
};

export type ProjectDocumentMdSuccessRawInput = z.infer<
  typeof projectDocumentMdSuccessValidator
>;

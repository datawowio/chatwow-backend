import { AI_MODEL_NAME } from '@domain/base/ai-model/ai-model.constant';
import z from 'zod';

// TODO: Uncomment after ai update
const _zod = {
  ai_usage_id: z.string(),
  confidence: z.number(),
  token_usage: z.array(
    z.object({
      input_tokens: z.number(),
      output_tokens: z.number(),
      total_tokens: z.number(),
      cache_creation_input_tokens: z.number(),
      cache_read_input_tokens: z.number(),
      model_name: z.enum(AI_MODEL_NAME),
    }),
  ),
};

export const projectMdSuccessValidator = z.object({
  project_id: z.string(),
});
// .extend(zod);

export const projectDocumentMdSuccessValidator = z.object({
  project_document_id: z.string(),
});
// .extend(zod);

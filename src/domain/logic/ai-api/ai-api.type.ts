import { AiModelName } from '@domain/base/ai-model/ai-model.type';
import { AppConfiguration } from '@domain/base/app-configuration/app-configuration.domain';
import { Project } from '@domain/base/project/project.domain';
import { AxiosError } from 'axios';

export type SendAiApiOpts = {
  text: string;
  project: Project;
  sessionId: string;
  aiConfig: AppConfiguration<'AI'>;
};

export type AiRequest = {
  text: string;
  project_id: string;
  session_id: string;
};

export type RawTokenUsage = {
  input_tokens: number;
  output_tokens: number;
  total_tokens: number;
  cache_creation_input_tokens: number;
  cache_read_input_tokens: number;
  model_name: string;
};
export type AiRawResponse = {
  text: string;
  token_usage: RawTokenUsage[];
};

export type TokenUsage = {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  cacheCreationInputTokens: number;
  cacheReadInputTokens: number;
  modelName: AiModelName;
};
export type AiResponse = {
  text: string;
  confidence: number;
  tokenUsage: TokenUsage[];
};

export type AiChat =
  | { isSuccess: true; data: AiResponse }
  | { isSuccess: false; data: unknown; err: AxiosError };

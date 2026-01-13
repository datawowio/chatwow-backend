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

export type AiRawResponse = {
  text: string;
  token_used: number;
};
export type AiResponse = {
  text: string;
  tokenUsed: number;
  confidence: number;
};

export type AiChat =
  | { isSuccess: true; data: AiResponse }
  | { isSuccess: false; data: unknown; err: AxiosError };

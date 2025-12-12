import { LineSession } from '@domain/base/line-session/line-session.domain';
import { Project } from '@domain/base/project/project.domain';

export type SendAiApiOpts = {
  text: string;
  project: Project;
  lineSession: LineSession;
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
};

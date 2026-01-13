import { JobInput } from '@app/worker/worker.type';

export type ProjectMdGenerateJobInput = JobInput<{
  project_id: string;
  ai_usage_id: string;
}>;

export type ProjectDocumentMdGenerateJobInput = JobInput<{
  project_id: string;
  project_document_id: string;
  ai_usage_id: string;
}>;

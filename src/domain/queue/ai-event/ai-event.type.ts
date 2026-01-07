import { JobInput } from '@app/worker/worker.type';

type AdditionalMeta = { ai_usage_id: string };

export type ProjectMdGenerateJobInput = JobInput<
  {
    project_id: string;
  },
  AdditionalMeta
>;
export type ProjectDocumentMdGenerateJobInput = JobInput<
  {
    project_id: string;
    project_document_id: string;
  },
  AdditionalMeta
>;

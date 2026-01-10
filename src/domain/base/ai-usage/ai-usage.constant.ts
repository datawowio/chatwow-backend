import { AiUsageAction } from '@infra/db/db';

import { UnionArray } from '@shared/common/common.type';

export const AI_USAGE_REF_TABLE = {
  PROJECT_DOCUMENT: 'project_documents',
  PROJECT: 'projects',
  PROJECT_CHAT_LOG: 'project_chat_logs',
  LINE_CHAT_LOG: 'line_chat_logs',
} as const;
export type AiUsageRefTable =
  (typeof AI_USAGE_REF_TABLE)[keyof typeof AI_USAGE_REF_TABLE];

export const AI_USAGE_ACTION: UnionArray<AiUsageAction> = [
  'CHAT_LINE',
  'CHAT_PROJECT',
  'GENERATE_PROJECT_DOCUMENT_SUMMARY',
  'GENERATE_PROJECT_SUMMARY',
] as const;
export const AI_USAGE_CHAT_ACTION = ['CHAT_LINE', 'CHAT_PROJECT'] as const;

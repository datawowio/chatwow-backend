export const AI_USAGE_REF_TABLE = {
  PROJECT_DOCUMENT: 'project_documents',
  PROJECT: 'projects',
  PROJECT_CHAT_LOG: 'project_chat_logs',
  LINE_CHAT_LOG: 'line_chat_logs',
} as const;
export type AiUsageRefTable =
  (typeof AI_USAGE_REF_TABLE)[keyof typeof AI_USAGE_REF_TABLE];

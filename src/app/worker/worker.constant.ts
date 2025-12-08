import { values } from 'remeda';

export const DOMAIN_EVENT_QUEUES = {
  SEND_VERIFICATION: { name: 'send-verification' },
  FORGOT_PASSWORD: { name: 'forgot-password' },
  SAVED_PROJECT_DOCUMENT: { name: 'saved-project-document' },
  SAVED_PROJECT: { name: 'saved-project' },
} as const satisfies Record<string, QueueConfig>;

export const CRON_QUEUES = {
  SAMPLE: { name: 'sample' },
  CLEAN_UP: { name: 'cleanup' },
} as const;

export const LINE_EVENT_QUEUES = {
  PROCESS_RAW: { name: 'process-raw' },
  PROCESS_VERIFICATION: { name: 'process-verification' },
  SHOW_SELECTION_MENU: { name: 'show-selection-menu' },
  PROCESS_SELECTION_MENU: { name: 'process-selection-menu' },
  PROCESS_AI_CHAT: { name: 'process-ai-chat' },
} as const;

export const AI_EVENT_QUEUES = {
  PROJECT_MD_GENERATE: { name: 'project-md-generate' },
  PROJECT_MD_SUCCESS: { name: 'project-md-success' },
  PROJECT_DOCUMENT_MD_GENERATE: { name: 'project-document-md-generate' },
  PROJECT_DOCUMENT_MD_SUCCESS: { name: 'project-document-md-success' },
} as const satisfies Record<string, QueueConfig>;

export const MQ_EXCHANGE = {
  DOMAIN_EVENT: {
    name: 'domain-event',
    queues: values(DOMAIN_EVENT_QUEUES),
  },
  CRON: {
    name: 'cron',
    queues: values(CRON_QUEUES),
  },
  LINE_EVENT: {
    name: 'line-event',
    queues: values(LINE_EVENT_QUEUES),
  },
} as const satisfies Record<string, ExchangeConfig>;

export type MQ_EXCHANGE = (typeof MQ_EXCHANGE)[keyof typeof MQ_EXCHANGE];

export type QueueConfig = {
  name: string;
  config?: {
    retry?: {
      // default true
      enable?: boolean;
      backOffMilliSeconds?: number;
    };
  };
};
export type ExchangeConfig = {
  name: string;
  queues: QueueConfig[];
};

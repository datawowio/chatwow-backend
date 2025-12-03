import { values } from 'remeda';

export const DOMAIN_EVENT_QUEUES = {
  SEND_VERIFICATION: 'send-verification',
  FORGOT_PASSWORD: 'forgot-password',
} as const;

export const CRON_QUEUES = {
  SAMPLE: 'sample',
  CLEAN_UP: 'cleanup',
} as const;

export const LINE_EVENT_QUEUES = {
  PROCESS_RAW: 'process-raw',
  PROCESS_VERIFICATION: 'process-verification',
  SHOW_SELECTION_MENU: 'show-selection-menu',
  PROCESS_SELECTION_MENU: 'process-selection-menu',
  PROCESS_AI_CHAT: 'process-ai-chat',
} as const;

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
export type ExchangeConfig = {
  name: string;
  queues: string[];
};

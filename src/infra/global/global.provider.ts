import type { Provider } from '@nestjs/common';

import { AmqpClientProvider } from './amqp/amqp.provider';
import { AmqpService } from './amqp/amqp.service';
import { RedisCacheProvider } from './cache/cache.provider';
import { CacheService } from './cache/cache.service';
import { NodeMailerProvider } from './email/email.provider';
import { EmailService } from './email/email.service';
import { LangService } from './lang/lang.service';
import { LoggerService } from './logger/logger.service';
import { ReqStorage } from './req-storage/req-storage.service';
import { StorageProvider } from './storage/storage.provider';
import { StorageService } from './storage/storage.service';

export const GLOBAL_PROVIDER: Provider[] = [
  // Provider
  RedisCacheProvider,
  NodeMailerProvider,
  StorageProvider,
  AmqpClientProvider,

  // Service
  LoggerService,
  CacheService,
  EmailService,
  LangService,
  ReqStorage,
  StorageService,
  AmqpService,
];

import { NestFactory } from '@nestjs/core';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import qs from 'qs';

import { config } from '@infra/config';
import { KYSELY, runMigrations } from '@infra/db/db.common';

import { coreLogger } from '@shared/common/common.logger';
import { setupApp, setupSwagger } from '@shared/http/http.setup';

import { AppApiModule } from './app/app.module';

const appConfig = config().app;
const dbConfig = config().database;

async function bootstrap() {
  const app = await NestFactory.create(
    AppApiModule,
    new FastifyAdapter({
      querystringParser: (str) => qs.parse(str),
    }),
    {
      rawBody: true,
      logger: coreLogger(appConfig),
      cors: {
        origin: appConfig.corsOrigin,
        methods: ['PATCH', 'HEAD', 'POST', 'GET', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: [
          'x-device',
          'content-type',
          'authorization',
          'trace-id',
          'idempotency-key',
        ],
      },
    },
  );

  setupApp(app, appConfig);

  if (appConfig.enableSwagger) {
    setupSwagger(app);
  }

  // Run migration
  if (dbConfig.enableAutoMigrate) {
    await runMigrations(app.get(KYSELY));
  }

  app.enableShutdownHooks();
  await app.listen(appConfig.apiPort, '0.0.0.0');
}
bootstrap();

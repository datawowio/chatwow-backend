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
      logger: coreLogger(appConfig),
      cors: { origin: ['http://localhost:8081'] },
    },
  );

  setupApp(app);

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

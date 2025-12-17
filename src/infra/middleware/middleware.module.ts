import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import { HttpExceptionFilter } from '@infra/middleware/filter/http-exception.filter';

import myDayjs from '@shared/common/common.dayjs';

import { JwtGuard } from './jwt/jwt.guard';
import { ReqStorageInterceptor } from './req-storage/req-storage.interceptor';
import { CoreZodValidationPipe } from './validation/zod-validation.pipe';

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const nodeEnv = configService.get<string>('NODE_ENV');

        return {
          throttlers: [
            {
              ttl: myDayjs.duration({ seconds: 60 }).asMilliseconds(),
              limit: nodeEnv === 'local' ? 20000 : 20,
            },
          ],
        };
      },
    }),
  ],
  providers: [
    // interceptors
    {
      provide: APP_INTERCEPTOR,
      useClass: ReqStorageInterceptor,
    },

    // guards
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },

    // filters
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },

    // pipes
    {
      provide: APP_PIPE,
      useClass: CoreZodValidationPipe,
    },
  ],
})
export class MiddlewareModule {}

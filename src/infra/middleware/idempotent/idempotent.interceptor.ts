import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Type,
  UseInterceptors,
  applyDecorators,
  mixin,
} from '@nestjs/common';
import type { FastifyRequest } from 'fastify';
import { Observable, tap } from 'rxjs';

import { CacheService } from '@infra/global/cache/cache.service';

import myDayjs from '@shared/common/common.dayjs';
import { DayjsDuration } from '@shared/common/common.type';
import { isUuid } from '@shared/common/common.validator';
import { ApiException } from '@shared/http/http.exception';

import { IDEMPOTENT_CONTEXT, IdempotentContext } from './idempotent.common';

export function UseIdempotent(
  cacheDuration?: DayjsDuration,
): MethodDecorator & ClassDecorator {
  const Intercept = createIdempotentInterceptor(cacheDuration);
  return applyDecorators(UseInterceptors(Intercept));
}

export function createIdempotentInterceptor(
  cacheDuration?: DayjsDuration,
): Type<NestInterceptor> {
  @Injectable()
  class IdempotentInterceptorMixin implements NestInterceptor {
    constructor(private readonly cacheService: CacheService) {}

    async intercept(
      context: ExecutionContext,
      next: CallHandler,
    ): Promise<Observable<any>> {
      const req = context.switchToHttp().getRequest<FastifyRequest>();

      const idempotencyKey = req.headers['idempotency-key'] as string;
      if (!idempotencyKey || !isUuid(idempotencyKey)) {
        throw new ApiException(400, 'missingIdempotencyKey');
      }

      const cacheKey = `idempotent:${idempotencyKey}`;
      const exists = await this.cacheService.get<number>(cacheKey);

      const ctx: IdempotentContext = {
        idempotencyKey,
        isDuplicateRequest: !!exists,
      };

      req[IDEMPOTENT_CONTEXT] = ctx;

      return next.handle().pipe(
        tap(async () => {
          if (!exists) {
            await this.cacheService.set(
              cacheKey,
              'true',
              myDayjs.duration(cacheDuration ?? { minutes: 1 }).asSeconds(),
            );
          }
        }),
      );
    }
  }

  return mixin(IdempotentInterceptorMixin);
}

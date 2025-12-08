import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const IDEMPOTENT_CONTEXT = '_idempotent';
export type IdempotentContext = {
  idempotencyKey: string;
  isDuplicateRequest: boolean;
};

export const IdempotentContext = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): IdempotentContext => {
    const req = ctx.switchToHttp().getRequest();
    return req[IDEMPOTENT_CONTEXT];
  },
);

import { ISignInModeWithAll } from '@domain/logic/auth/auth.constant';
import type { ExecutionContext } from '@nestjs/common';
import { SetMetadata, createParamDecorator } from '@nestjs/common';

import type { UserRole } from '@infra/db/db';

export const USER_CONTEXT = 'user';

export type UserJwtEncoded = {
  userId: string;
  role: UserRole;
  mode: ISignInModeWithAll;
};

export type UserClaims = {
  userId: string;
  role: UserRole;
};

export const IS_PUBLIC_KEY = 'isPublic';
export const UsePublic = () => SetMetadata(IS_PUBLIC_KEY, true);

export const UserClaims = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserClaims => {
    const req = ctx.switchToHttp().getRequest();
    const userCtx: UserJwtEncoded = req[USER_CONTEXT];

    return {
      userId: userCtx.userId,
      role: userCtx.role,
    };
  },
);

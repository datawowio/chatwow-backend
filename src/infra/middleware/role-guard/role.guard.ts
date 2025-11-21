import {
  CanActivate,
  ExecutionContext,
  Type,
  UseGuards,
  applyDecorators,
  mixin,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';

import { UserRole } from '@infra/db/db';

import { ApiException } from '@shared/http/http.exception';

import { USER_CONTEXT, UserClaims } from '../jwt/jwt.common';

export function UseRoleGuard(
  allowedRoles: UserRole[],
): MethodDecorator & ClassDecorator {
  const Guard = createRoleGuard(allowedRoles);
  return applyDecorators(UseGuards(Guard));
}

function createRoleGuard(allowedRoles: UserRole[]): Type<CanActivate> {
  class RoleGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
      const request = context.switchToHttp().getRequest<FastifyRequest>();
      const claims: UserClaims = request[USER_CONTEXT];

      if (!claims) {
        throw new ApiException(403, 'forbiddenUser');
      }

      if (!claims.role || !allowedRoles.includes(claims.role)) {
        throw new ApiException(403, 'forbiddenRole');
      }

      return true;
    }
  }

  return mixin(RoleGuardMixin);
}

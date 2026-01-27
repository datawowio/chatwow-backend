import type { User } from '@domain/base/user/user.domain';
import { ok } from 'neverthrow';

import { UserRole } from '@infra/db/db';

import { encodeUserJwt } from '@shared/common/common.crypto';
import myDayjs from '@shared/common/common.dayjs';
import { ApiException } from '@shared/http/http.exception';

import { ISignInMode, ISignInModeWithAll } from './auth.constant';

type SignInOpts = {
  user: User;
  password: string;
  signInMode: ISignInMode;
};
export function signIn({ user, password, signInMode }: SignInOpts) {
  if (!user.password) {
    throw new ApiException(400, 'invalidAuth');
  }

  const matched = user.isPasswordValid(password);
  if (!matched) {
    throw new ApiException(400, 'invalidAuth');
  }

  if (signInMode === 'backoffice') {
    if (user.role === 'USER') {
      throw new ApiException(403, 'forbiddenAccess');
    }
  }

  user.edit({
    data: {
      lastSignedInAt: myDayjs().toDate(),
    },
  });

  return ok(null);
}

export function getSignInModeFromRole(role: UserRole): ISignInModeWithAll {
  if (role === 'USER') {
    return 'chat-portal';
  }

  return 'all';
}

export function getAccessToken(user: User) {
  return encodeUserJwt(user, getSignInModeFromRole(user.role));
}

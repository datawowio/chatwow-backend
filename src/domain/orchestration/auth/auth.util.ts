import type { User } from '@domain/base/user/user.domain';
import { ok } from 'neverthrow';

import { encodeUserJwt, isMatchedHash } from '@shared/common/common.crypto';
import myDayjs from '@shared/common/common.dayjs';
import { ApiException } from '@shared/http/http.exception';

type SignInOpts = {
  user: User;
  password: string;
};
export function signIn({ user, password }: SignInOpts) {
  if (!user.password) {
    throw new ApiException(400, 'invalidAuth');
  }

  const matched = isMatchedHash(password, user.password);
  if (!matched) {
    throw new ApiException(400, 'invalidAuth');
  }

  user.edit({
    data: {
      lastSignedInAt: myDayjs().toDate(),
    },
  });

  return ok(null);
}

export function getAccessToken(user: User) {
  return encodeUserJwt(user);
}

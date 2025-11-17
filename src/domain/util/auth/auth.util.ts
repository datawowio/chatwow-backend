import type { User } from '@domain/base/user/user.domain';
import { err, ok } from 'neverthrow';

import { encodeUserJwt, isMatchedHash } from '@shared/common/common.crypto';
import myDayjs from '@shared/common/common.dayjs';

type SignInOpts = {
  user: User;
  password: string;
};
export function signIn({ user, password }: SignInOpts) {
  const matched = isMatchedHash(password, user.password);
  if (!matched) {
    return err('invalidPassword');
  }

  user.edit({
    lastSignedInAt: myDayjs().toDate(),
  });

  return ok(null);
}

export function getAccessToken(user: User) {
  return encodeUserJwt({ id: user.id });
}

import type { UserVerifications } from '@infra/db/db';
import type { DBModel } from '@infra/db/db.common';

import type { Plain, Serialized } from '@shared/common/common.type';

import type { UserVerification } from '../user-verification.domain';

export type UserVerificationPg = DBModel<UserVerifications>;
export type UserVerificationPlain = Plain<UserVerification>;

export type UserVerificationJson = Serialized<UserVerificationPlain>;

export type UserVerificationNewData = {
  userId: string;
};

export type UserVerificationUpdateData = {
  expireAt?: Date;
  revokeAt?: Date | null;
};

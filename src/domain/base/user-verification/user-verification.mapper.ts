import { toDate, toISO } from '@shared/common/common.transformer';

import { UserVerification } from './user-verification.domain';
import { UserVerificationResponse } from './user-verification.response';
import type {
  UserVerificationJson,
  UserVerificationPg,
  UserVerificationPlain,
} from './user-verification.type';

export function userVerificationFromPg(
  pg: UserVerificationPg,
): UserVerification {
  const plain: UserVerificationPlain = {
    id: pg.id,
    createdAt: toDate(pg.created_at),
    userId: pg.user_id,
    expireAt: toDate(pg.expire_at),
    revokeAt: toDate(pg.revoke_at),
    code: pg.code,
  };

  return new UserVerification(plain);
}

export function userVerificationFromPgWithState(
  pg: UserVerificationPg,
): UserVerification {
  return userVerificationFromPg(pg).setPgState(userVerificationToPg);
}

export function userVerificationFromPlain(
  plainData: UserVerificationPlain,
): UserVerification {
  const plain: UserVerificationPlain = {
    id: plainData.id,
    createdAt: plainData.createdAt,
    userId: plainData.userId,
    expireAt: plainData.expireAt,
    revokeAt: plainData.revokeAt,
    code: plainData.code,
  };

  return new UserVerification(plain);
}

export function userVerificationFromJson(
  json: UserVerificationJson,
): UserVerification {
  const plain: UserVerificationPlain = {
    id: json.id,
    createdAt: toDate(json.createdAt),
    userId: json.userId,
    expireAt: toDate(json.expireAt),
    revokeAt: toDate(json.revokeAt),
    code: json.code,
  };

  return new UserVerification(plain);
}

export function userVerificationToPg(
  userVerification: UserVerification,
): UserVerificationPg {
  return {
    id: userVerification.id,
    created_at: userVerification.createdAt.toISOString(),
    user_id: userVerification.userId,
    expire_at: userVerification.expireAt.toISOString(),
    revoke_at: toISO(userVerification.revokeAt),
    code: userVerification.code,
  };
}

export function userVerificationToPlain(
  userVerification: UserVerification,
): UserVerificationPlain {
  return {
    id: userVerification.id,
    createdAt: userVerification.createdAt,
    userId: userVerification.userId,
    expireAt: userVerification.expireAt,
    revokeAt: userVerification.revokeAt,
    code: userVerification.code,
  };
}

export function userVerificationToJson(
  userVerification: UserVerification,
): UserVerificationJson {
  return {
    id: userVerification.id,
    createdAt: toISO(userVerification.createdAt),
    userId: userVerification.userId,
    expireAt: toISO(userVerification.expireAt),
    revokeAt: toISO(userVerification.revokeAt),
    code: userVerification.code,
  };
}

export function userVerificationToResponse(
  userVerification: UserVerification,
): UserVerificationResponse {
  return {
    id: userVerification.id,
    createdAt: toISO(userVerification.createdAt),
    userId: userVerification.userId,
    expireAt: toISO(userVerification.expireAt),
    revokeAt: toISO(userVerification.revokeAt),
  };
}

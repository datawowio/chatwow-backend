import {
  toDate,
  toISO,
  toResponseDate,
} from '@shared/common/common.transformer';
import { WithPgState } from '@shared/common/common.type';

import { PasswordResetToken } from './password-reset-token.domain';
import { PasswordResetTokenResponse } from './password-reset-token.response';
import type {
  PasswordResetTokenJson,
  PasswordResetTokenPg,
  PasswordResetTokenPlain,
} from './password-reset-token.type';

export function passwordResetTokenFromPg(
  pg: PasswordResetTokenPg,
): PasswordResetToken {
  const plain: PasswordResetTokenPlain = {
    id: pg.id,
    userId: pg.user_id,
    tokenHash: pg.token_hash,
    createdAt: toDate(pg.created_at),
    expireAt: toDate(pg.expire_at),
    revokeAt: toDate(pg.revoke_at),
  };

  return new PasswordResetToken(plain);
}

export function passwordResetTokenFromPgWithState(
  pg: PasswordResetTokenPg,
): PasswordResetToken {
  return passwordResetTokenFromPg(pg).setPgState(passwordResetTokenToPg);
}

export function passwordResetTokenFromPlain(
  plainData: PasswordResetTokenPlain,
): PasswordResetToken {
  const plain: PasswordResetTokenPlain = {
    id: plainData.id,
    userId: plainData.userId,
    tokenHash: plainData.tokenHash,
    createdAt: plainData.createdAt,
    expireAt: plainData.expireAt,
    revokeAt: plainData.revokeAt,
  };

  return new PasswordResetToken(plain);
}

export function passwordResetTokenFromJson(
  json: PasswordResetTokenJson,
): PasswordResetToken {
  const plain: PasswordResetTokenPlain = {
    id: json.id,
    userId: json.userId,
    tokenHash: json.tokenHash,
    createdAt: toDate(json.createdAt),
    expireAt: toDate(json.expireAt),
    revokeAt: toDate(json.revokeAt),
  };

  return new PasswordResetToken(plain);
}

export function passwordResetTokenFromJsonState(
  jsonState: WithPgState<PasswordResetTokenJson, PasswordResetTokenPg>,
): PasswordResetToken {
  const domain = passwordResetTokenFromJson(jsonState.data);
  domain.setPgState(jsonState.state);

  return domain;
}

export function passwordResetTokenToPg(
  t: PasswordResetToken,
): PasswordResetTokenPg {
  return {
    id: t.id,
    user_id: t.userId,
    token_hash: t.tokenHash,
    created_at: toISO(t.createdAt),
    expire_at: toISO(t.expireAt),
    revoke_at: toISO(t.revokeAt),
  };
}

export function passwordResetTokenToPlain(
  t: PasswordResetToken,
): PasswordResetTokenPlain {
  return {
    id: t.id,
    userId: t.userId,
    tokenHash: t.tokenHash,
    createdAt: t.createdAt,
    expireAt: t.expireAt,
    revokeAt: t.revokeAt,
  };
}

export function passwordResetTokenToJson(
  t: PasswordResetToken,
): PasswordResetTokenJson {
  return {
    id: t.id,
    userId: t.userId,
    tokenHash: t.tokenHash,
    createdAt: toISO(t.createdAt),
    expireAt: toISO(t.expireAt),
    revokeAt: toISO(t.revokeAt),
  };
}

export function passwordResetTokenToJsonState(
  t: PasswordResetToken,
): WithPgState<PasswordResetTokenJson, PasswordResetTokenPg> {
  return {
    state: t.pgState,
    data: passwordResetTokenToJson(t),
  };
}

export function passwordResetTokenToResponse(
  t: PasswordResetToken,
): PasswordResetTokenResponse {
  return {
    id: t.id,
    createdAt: toResponseDate(t.createdAt),
    expireAt: toResponseDate(t.expireAt),
    revokedAt: toResponseDate(t.revokeAt),
  };
}

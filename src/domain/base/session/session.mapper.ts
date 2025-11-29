import type { JsonValue } from '@infra/db/db';
import { ReqInfo } from '@infra/global/req-storage/req-storage.common';

import {
  toDate,
  toISO,
  toResponseDate,
} from '@shared/common/common.transformer';

import { Session } from './session.domain';
import { SessionResponse } from './session.response';
import type { SessionJson, SessionPg, SessionPlain } from './session.type';

export function sessionFromPg(pg: SessionPg): Session {
  const plain: SessionPlain = {
    id: pg.id,
    userId: pg.user_id,
    tokenHash: pg.token_hash,
    deviceUid: pg.device_uid,
    createdAt: toDate(pg.created_at),
    expireAt: toDate(pg.expire_at),
    revokeAt: toDate(pg.revoke_at),
    info: pg.info as ReqInfo,
  };

  return new Session(plain);
}

export function sessionFromPgWithState(pg: SessionPg): Session {
  return sessionFromPg(pg).setPgState(sessionToPg);
}

export function sessionFromPlain(plainData: SessionPlain): Session {
  const plain: SessionPlain = {
    id: plainData.id,
    userId: plainData.userId,
    tokenHash: plainData.tokenHash,
    deviceUid: plainData.deviceUid,
    createdAt: plainData.createdAt,
    expireAt: plainData.expireAt,
    revokeAt: plainData.revokeAt,
    info: plainData.info,
  };

  return new Session(plain);
}

export function sessionToPg(s: Session): SessionPg {
  return {
    id: s.id,
    user_id: s.userId,
    token_hash: s.tokenHash,
    device_uid: s.deviceUid,
    created_at: toISO(s.createdAt),
    expire_at: toISO(s.expireAt),
    revoke_at: toISO(s.revokeAt),
    info: s.info as JsonValue,
  };
}

export function sessionToPlain(s: Session): SessionPlain {
  return {
    id: s.id,
    userId: s.userId,
    tokenHash: s.tokenHash,
    deviceUid: s.deviceUid,
    createdAt: s.createdAt,
    expireAt: s.expireAt,
    revokeAt: s.revokeAt,
    info: s.info,
  };
}

export function sessionToJson(s: Session): SessionJson {
  return {
    id: s.id,
    userId: s.userId,
    tokenHash: s.tokenHash,
    deviceUid: s.deviceUid,
    createdAt: toISO(s.createdAt),
    expireAt: toISO(s.expireAt),
    revokeAt: toISO(s.revokeAt),
    info: s.info,
  };
}

export function sessionToResponse(s: Session): SessionResponse {
  return {
    id: s.id,
    createdAt: toResponseDate(s.createdAt),
    expireAt: toResponseDate(s.expireAt),
    revokeAt: toResponseDate(s.revokeAt),
  };
}

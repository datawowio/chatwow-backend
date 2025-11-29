import type { Sessions } from '@infra/db/db';
import type { DBModel } from '@infra/db/db.common';
import { ReqInfo } from '@infra/global/req-storage/req-storage.common';

import type { Plain, Serialized } from '@shared/common/common.type';

import type { Session } from './session.domain';

export type SessionPg = DBModel<Sessions>;
export type SessionPlain = Plain<Session>;
export type SessionJson = Serialized<SessionPlain>;

export type SessionNewData = {
  userId: string;
  token: string;
  deviceUid: string;
  expireAt?: Date;
  info: ReqInfo;
};

export type SessionUpdateData = {
  tokenHash?: string;
  deviceUid?: string;
  expireAt?: Date;
  revokeAt?: Date | null;
  info?: any;
};

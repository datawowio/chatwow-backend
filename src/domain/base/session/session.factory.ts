import { shaHashstring, uuidV7 } from '@shared/common/common.crypto';
import myDayjs from '@shared/common/common.dayjs';
import { isDefined } from '@shared/common/common.validator';

import { SESSION_DEFAULT_EXPIRY_SECONDS } from './session.constant';
import { Session } from './session.domain';
import { sessionFromPlain } from './session.mapper';
import type { SessionNewData } from './session.type';

export function newSession(data: SessionNewData): Session {
  return sessionFromPlain({
    id: uuidV7(),
    userId: data.userId,
    tokenHash: shaHashstring(data.token),
    deviceUid: data.deviceUid,
    createdAt: myDayjs().toDate(),
    expireAt: isDefined(data.expireAt)
      ? data.expireAt
      : myDayjs().add(SESSION_DEFAULT_EXPIRY_SECONDS, 'seconds').toDate(),
    revokeAt: null,
    info: data.info,
  });
}

export function newSessions(data: SessionNewData[]): Session[] {
  return data.map((d) => newSession(d));
}

import type { LineSessionStatus, LineSessions } from '@infra/db/db';
import type { DBModel } from '@infra/db/db.common';

import type {
  Plain,
  Serialized,
  WithPgState,
} from '@shared/common/common.type';

import type { LineSession } from '../line-session.domain';

export type LineSessionPg = DBModel<LineSessions>;
export type LineSessionPlain = Plain<LineSession>;
export type LineSessionJson = Serialized<LineSessionPlain>;
export type LineSessionJsonState = WithPgState<LineSessionJson, LineSessionPg>;

export type LineSessionNewData = {
  projectId: string;
  lineAccountId: string;
  lineBotId: string;
  latestChatLogId?: string | null;
  lineSessionStatus?: LineSessionStatus;
};

export type LineSessionUpdateData = {
  latestChatLogId?: string | null;
  lineSessionStatus?: LineSessionStatus;
};

import type { LineSessions } from '@infra/db/db';
import type { DBModel } from '@infra/db/db.common';

import type { Plain, Serialized } from '@shared/common/common.type';

import type { LineSession } from '../line-session.domain';

export type LineSessionPg = DBModel<LineSessions>;
export type LineSessionPlain = Plain<LineSession>;
export type LineSessionJson = Serialized<LineSessionPlain>;

export type LineSessionNewData = {
  lineAccountId: string;
  projectId: string;
  latestChatLogId?: string | null;
};

export type LineSessionUpdateData = {
  latestChatLogId?: string | null;
};

import type { LineAccounts } from '@infra/db/db';
import type { DBModel } from '@infra/db/db.common';

import type { Plain, Serialized } from '@shared/common/common.type';

import type { LineAccount } from './line-account.domain';

export type LineAccountPg = DBModel<LineAccounts>;
export type LineAccountPlain = Plain<LineAccount>;
export type LineAccountJson = Serialized<LineAccountPlain>;

export type LineAccountNewData = {
  id: string;
  activeLineSessionId?: string | null;
};

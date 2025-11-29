import myDayjs from '@shared/common/common.dayjs';

import { LineAccount } from './line-account.domain';
import { lineAccountFromPlain } from './line-account.mapper';
import type { LineAccountNewData } from './line-account.type';

export function newLineAccount(data: LineAccountNewData): LineAccount {
  return lineAccountFromPlain({
    id: data.id,
    createdAt: myDayjs().toDate(),
  });
}

export function newLineAccounts(data: LineAccountNewData[]): LineAccount[] {
  return data.map((d) => newLineAccount(d));
}

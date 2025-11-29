import { toDate, toISO } from '@shared/common/common.transformer';

import { LineAccount } from './line-account.domain';
import type { LineAccountResponse } from './line-account.response';
import type { LineAccountPg, LineAccountPlain } from './line-account.type';

export function lineAccountFromPg(pg: LineAccountPg): LineAccount {
  const plain: LineAccountPlain = {
    id: pg.id,
    createdAt: toDate(pg.created_at),
  };
  return new LineAccount(plain);
}

export function lineAccountFromPgWithState(pg: LineAccountPg): LineAccount {
  return lineAccountFromPg(pg).setPgState(lineAccountToPg);
}

export function lineAccountFromPlain(plain: LineAccountPlain): LineAccount {
  return new LineAccount({
    id: plain.id,
    createdAt: plain.createdAt,
  });
}

export function lineAccountToPg(lineAccount: LineAccount): LineAccountPg {
  return {
    id: lineAccount.id,
    created_at: toISO(lineAccount.createdAt),
  };
}

export function lineAccountToPlain(lineAccount: LineAccount): LineAccountPlain {
  return {
    id: lineAccount.id,
    createdAt: lineAccount.createdAt,
  };
}

export function lineAccountToResponse(
  lineAccount: LineAccount,
): LineAccountResponse {
  return {
    id: lineAccount.id,
    createdAt: toISO(lineAccount.createdAt),
  };
}

export function lineAccountPgToResponse(
  pg: LineAccountPg,
): LineAccountResponse {
  return {
    id: pg.id,
    createdAt: toISO(pg.created_at),
  };
}

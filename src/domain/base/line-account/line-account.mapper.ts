import { toDate, toISO } from '@shared/common/common.transformer';

import { LineAccount } from './line-account.domain';
import type { LineAccountResponse } from './line-account.response';
import type {
  LineAccountPg,
  LineAccountPlain,
} from './types/line-account.domain.type';

export class LineAccountMapper {
  static fromPg(pg: LineAccountPg): LineAccount {
    const plain: LineAccountPlain = {
      id: pg.id,
      createdAt: toDate(pg.created_at),
      activeLineSessionId: pg.active_line_session_id,
    };
    return new LineAccount(plain);
  }

  static fromPgWithState(pg: LineAccountPg): LineAccount {
    return this.fromPg(pg).setPgState(this.toPg);
  }

  static fromPlain(plain: LineAccountPlain): LineAccount {
    return new LineAccount({
      id: plain.id,
      createdAt: plain.createdAt,
      activeLineSessionId: plain.activeLineSessionId,
    });
  }

  static toPg(lineAccount: LineAccount): LineAccountPg {
    return {
      id: lineAccount.id,
      created_at: toISO(lineAccount.createdAt),
      active_line_session_id: lineAccount.activeLineSessionId,
    };
  }

  static toPlain(lineAccount: LineAccount): LineAccountPlain {
    return {
      id: lineAccount.id,
      createdAt: lineAccount.createdAt,
      activeLineSessionId: lineAccount.activeLineSessionId,
    };
  }

  static toResponse(lineAccount: LineAccount): LineAccountResponse {
    return {
      id: lineAccount.id,
      createdAt: toISO(lineAccount.createdAt),
    };
  }
}

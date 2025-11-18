import { toDate, toISO } from '@shared/common/common.transformer';

import { LineSession } from './line-session.domain';
import type {
  LineSessionPg,
  LineSessionPlain,
} from './types/line-session.domain.type';

export class LineSessionMapper {
  static fromPg(pg: LineSessionPg): LineSession {
    const plain: LineSessionPlain = {
      id: pg.id,
      latestChatLogId: pg.latest_chat_log_id,
      createdAt: toDate(pg.created_at),
      updatedAt: toDate(pg.updated_at),
      lineAccountId: pg.line_account_id,
      projectId: pg.project_id,
    };

    return new LineSession(plain);
  }

  static fromPgWithState(pg: LineSessionPg): LineSession {
    return this.fromPg(pg); // add .setPgState(this.toPg) if needed
  }

  static fromPlain(plain: LineSessionPlain): LineSession {
    return new LineSession({
      id: plain.id,
      createdAt: plain.createdAt,
      updatedAt: plain.updatedAt,
      lineAccountId: plain.lineAccountId,
      projectId: plain.projectId,
      latestChatLogId: plain.latestChatLogId,
    });
  }

  static toPg(lineSession: LineSession): LineSessionPg {
    return {
      id: lineSession.id,
      created_at: toISO(lineSession.createdAt),
      updated_at: toISO(lineSession.updatedAt),
      line_account_id: lineSession.lineAccountId,
      project_id: lineSession.projectId,
      latest_chat_log_id: lineSession.latestChatLogId,
    };
  }

  static toPlain(lineSession: LineSession): LineSessionPlain {
    return {
      id: lineSession.id,
      createdAt: lineSession.createdAt,
      updatedAt: lineSession.updatedAt,
      lineAccountId: lineSession.lineAccountId,
      projectId: lineSession.projectId,
      latestChatLogId: lineSession.latestChatLogId,
    };
  }

  static toResponse(lineSession: LineSession) {
    return {
      id: lineSession.id,
      createdAt: lineSession.createdAt,
      updatedAt: lineSession.updatedAt,
      lineAccountId: lineSession.lineAccountId,
      projectId: lineSession.projectId,
    };
  }
}

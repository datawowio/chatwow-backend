import { toDate, toISO } from '@shared/common/common.transformer';

import { LineSession } from './line-session.domain';
import type {
  LineSessionJson,
  LineSessionJsonState,
  LineSessionPg,
  LineSessionPlain,
} from './line-session.type';

export function lineSessionFromPg(pg: LineSessionPg): LineSession {
  const plain: LineSessionPlain = {
    id: pg.id,
    latestChatLogId: pg.latest_chat_log_id,
    createdAt: toDate(pg.created_at),
    updatedAt: toDate(pg.updated_at),
    lineAccountId: pg.line_account_id,
    projectId: pg.project_id,
    lineSessionStatus: pg.line_session_status,
    lineBotId: pg.line_bot_id,
  };

  return new LineSession(plain);
}

export function lineSessionFromPgWithState(pg: LineSessionPg): LineSession {
  return lineSessionFromPg(pg).setPgState(lineSessionToPg);
}

export function lineSessionFromPlain(plain: LineSessionPlain): LineSession {
  return new LineSession({
    id: plain.id,
    createdAt: plain.createdAt,
    updatedAt: plain.updatedAt,
    lineAccountId: plain.lineAccountId,
    projectId: plain.projectId,
    latestChatLogId: plain.latestChatLogId,
    lineSessionStatus: plain.lineSessionStatus,
    lineBotId: plain.lineBotId,
  });
}

export function lineSessionFromJson(json: LineSessionJson): LineSession {
  const plain: LineSessionPlain = {
    id: json.id,
    createdAt: new Date(json.createdAt),
    updatedAt: new Date(json.updatedAt),
    lineAccountId: json.lineAccountId,
    projectId: json.projectId,
    latestChatLogId: json.latestChatLogId,
    lineSessionStatus: json.lineSessionStatus,
    lineBotId: json.lineBotId,
  };

  return new LineSession(plain);
}

export function lineSessionFromJsonWithState(
  data: LineSessionJsonState,
): LineSession {
  const lineSession = lineSessionFromJson(data.data);
  lineSession.setPgState(data.state);

  return lineSession;
}

export function lineSessionToPg(lineSession: LineSession): LineSessionPg {
  return {
    id: lineSession.id,
    created_at: toISO(lineSession.createdAt),
    updated_at: toISO(lineSession.updatedAt),
    line_account_id: lineSession.lineAccountId,
    project_id: lineSession.projectId,
    latest_chat_log_id: lineSession.latestChatLogId,
    line_session_status: lineSession.lineSessionStatus,
    line_bot_id: lineSession.lineBotId,
  };
}

export function lineSessionToPlain(lineSession: LineSession): LineSessionPlain {
  return {
    id: lineSession.id,
    createdAt: lineSession.createdAt,
    updatedAt: lineSession.updatedAt,
    lineAccountId: lineSession.lineAccountId,
    projectId: lineSession.projectId,
    latestChatLogId: lineSession.latestChatLogId,
    lineSessionStatus: lineSession.lineSessionStatus,
    lineBotId: lineSession.lineBotId,
  };
}

export function lineSessionToJson(lineSession: LineSession): LineSessionJson {
  return {
    id: lineSession.id,
    createdAt: lineSession.createdAt.toISOString(),
    updatedAt: lineSession.updatedAt.toISOString(),
    lineAccountId: lineSession.lineAccountId,
    projectId: lineSession.projectId,
    latestChatLogId: lineSession.latestChatLogId,
    lineSessionStatus: lineSession.lineSessionStatus,
    lineBotId: lineSession.lineBotId,
  };
}

export function lineSessionToJsonWithState(
  lineSession: LineSession,
): LineSessionJsonState {
  return {
    data: lineSessionToJson(lineSession),
    state: lineSession.pgState,
  };
}

import { toDate, toISO } from '@shared/common/common.transformer';

import { LineChatLog } from './line-chat-log.domain';
import type { LineChatLogResponse } from './line-chat-log.response';
import type {
  LineChatLogJson,
  LineChatLogPg,
  LineChatLogPlain,
} from './line-chat-log.type';

export function lineChatLogFromPg(pg: LineChatLogPg): LineChatLog {
  const plain: LineChatLogPlain = {
    id: pg.id,
    parentId: pg.parent_id,
    message: pg.message,
    createdAt: toDate(pg.created_at),
    lineSessionId: pg.line_session_id,
    chatSender: pg.chat_sender,
  };

  return new LineChatLog(plain);
}

export function lineChatLogFromPgWithState(pg: LineChatLogPg): LineChatLog {
  return lineChatLogFromPg(pg).setPgState(lineChatLogToPg);
}

export function lineChatLogFromPlain(plainData: LineChatLogPlain): LineChatLog {
  const plain: LineChatLogPlain = {
    id: plainData.id,
    parentId: plainData.parentId,
    message: plainData.message,
    createdAt: toDate(plainData.createdAt),
    lineSessionId: plainData.lineSessionId,
    chatSender: plainData.chatSender,
  };

  return new LineChatLog(plain);
}

export function lineChatLogFromJson(json: LineChatLogJson): LineChatLog {
  const plain: LineChatLogPlain = {
    id: json.id,
    parentId: json.parentId,
    message: json.message,
    createdAt: toDate(json.createdAt),
    lineSessionId: json.lineSessionId,
    chatSender: json.chatSender,
  };

  return new LineChatLog(plain);
}

export function lineChatLogToPg(domain: LineChatLog): LineChatLogPg {
  return {
    id: domain.id,
    parent_id: domain.parentId,
    chat_sender: domain.chatSender,
    created_at: toISO(domain.createdAt),
    line_session_id: domain.lineSessionId,
    message: domain.message,
  };
}

export function lineChatLogToPlain(domain: LineChatLog): LineChatLogPlain {
  return {
    id: domain.id,
    parentId: domain.parentId,
    message: domain.message,
    createdAt: domain.createdAt,
    lineSessionId: domain.lineSessionId,
    chatSender: domain.chatSender,
  };
}

export function lineChatLogToJson(domain: LineChatLog): LineChatLogJson {
  return {
    id: domain.id,
    parentId: domain.parentId,
    message: domain.message,
    createdAt: toISO(domain.createdAt),
    lineSessionId: domain.lineSessionId,
    chatSender: domain.chatSender,
  };
}

export function lineChatLogToResponse(
  domain: LineChatLog,
): LineChatLogResponse {
  return {
    id: domain.id,
    message: domain.message,
    createdAt: toISO(domain.createdAt),
    lineSessionId: domain.lineSessionId,
    chatSender: domain.chatSender,
  };
}

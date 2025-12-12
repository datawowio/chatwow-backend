import { toDate, toISO } from '@shared/common/common.transformer';

import { ProjectChatLog } from './project-chat-log.domain';
import { ProjectChatLogResponse } from './project-chat-log.response';
import type {
  ProjectChatLogJson,
  ProjectChatLogJsonState,
  ProjectChatLogPg,
  ProjectChatLogPlain,
} from './project-chat-log.type';

export function projectChatLogFromPg(pg: ProjectChatLogPg): ProjectChatLog {
  const plain: ProjectChatLogPlain = {
    id: pg.id,
    createdAt: toDate(pg.created_at),
    projectChatSessionId: pg.project_chat_session_id,
    chatSender: pg.chat_sender,
    message: pg.message,
    parentId: pg.parent_id,
  };

  return new ProjectChatLog(plain);
}

export function projectChatLogFromPgWithState(
  pg: ProjectChatLogPg,
): ProjectChatLog {
  return projectChatLogFromPg(pg).setPgState(projectChatLogToPg);
}

export function projectChatLogFromPlain(
  plain: ProjectChatLogPlain,
): ProjectChatLog {
  return new ProjectChatLog({
    id: plain.id,
    createdAt: plain.createdAt,
    projectChatSessionId: plain.projectChatSessionId,
    chatSender: plain.chatSender,
    message: plain.message,
    parentId: plain.parentId,
  });
}

export function projectChatLogFromJson(
  json: ProjectChatLogJson,
): ProjectChatLog {
  const plain: ProjectChatLogPlain = {
    id: json.id,
    createdAt: new Date(json.createdAt),
    projectChatSessionId: json.projectChatSessionId,
    chatSender: json.chatSender,
    message: json.message,
    parentId: json.parentId,
  };

  return new ProjectChatLog(plain);
}

export function projectChatLogFromJsonWithState(
  data: ProjectChatLogJsonState,
): ProjectChatLog {
  const projectChatLog = projectChatLogFromJson(data.data);
  projectChatLog.setPgState(data.state);

  return projectChatLog;
}

export function projectChatLogToPg(
  projectChatLog: ProjectChatLog,
): ProjectChatLogPg {
  return {
    id: projectChatLog.id,
    created_at: toISO(projectChatLog.createdAt),
    project_chat_session_id: projectChatLog.projectChatSessionId,
    chat_sender: projectChatLog.chatSender,
    message: projectChatLog.message,
    parent_id: projectChatLog.parentId,
  };
}

export function projectChatLogToPlain(
  projectChatLog: ProjectChatLog,
): ProjectChatLogPlain {
  return {
    id: projectChatLog.id,
    createdAt: projectChatLog.createdAt,
    projectChatSessionId: projectChatLog.projectChatSessionId,
    chatSender: projectChatLog.chatSender,
    message: projectChatLog.message,
    parentId: projectChatLog.parentId,
  };
}

export function projectChatLogToJson(
  projectChatLog: ProjectChatLog,
): ProjectChatLogJson {
  return {
    id: projectChatLog.id,
    createdAt: toISO(projectChatLog.createdAt),
    projectChatSessionId: projectChatLog.projectChatSessionId,
    chatSender: projectChatLog.chatSender,
    message: projectChatLog.message,
    parentId: projectChatLog.parentId,
  };
}

export function projectChatLogToJsonWithState(
  projectChatLog: ProjectChatLog,
): ProjectChatLogJsonState {
  return {
    data: projectChatLogToJson(projectChatLog),
    state: projectChatLog.pgState,
  };
}

export function projectChatLogToResponse(
  projectChatLog: ProjectChatLog,
): ProjectChatLogResponse {
  return {
    id: projectChatLog.id,
    createdAt: toISO(projectChatLog.createdAt),
  };
}

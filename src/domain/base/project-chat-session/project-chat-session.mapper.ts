import { toDate, toISO } from '@shared/common/common.transformer';

import { ProjectChatSession } from './project-chat-session.domain';
import { ProjectChatSessionResponse } from './project-chat-session.response';
import type {
  ProjectChatSessionJson,
  ProjectChatSessionJsonState,
  ProjectChatSessionPg,
  ProjectChatSessionPlain,
} from './project-chat-session.type';

export function projectChatSessionFromPg(
  pg: ProjectChatSessionPg,
): ProjectChatSession {
  const plain: ProjectChatSessionPlain = {
    id: pg.id,
    createdAt: toDate(pg.created_at),
    userId: pg.user_id,
    projectId: pg.project_id,
    latestChatLogId: pg.latest_chat_log_id,
  };

  return new ProjectChatSession(plain);
}

export function projectChatSessionFromPgWithState(
  pg: ProjectChatSessionPg,
): ProjectChatSession {
  return projectChatSessionFromPg(pg).setPgState(projectChatSessionToPg);
}

export function projectChatSessionFromPlain(
  plain: ProjectChatSessionPlain,
): ProjectChatSession {
  return new ProjectChatSession({
    id: plain.id,
    createdAt: plain.createdAt,
    userId: plain.userId,
    projectId: plain.projectId,
    latestChatLogId: plain.latestChatLogId,
  });
}

export function projectChatSessionFromJson(
  json: ProjectChatSessionJson,
): ProjectChatSession {
  const plain: ProjectChatSessionPlain = {
    id: json.id,
    createdAt: new Date(json.createdAt),
    userId: json.userId,
    projectId: json.projectId,
    latestChatLogId: json.latestChatLogId,
  };

  return new ProjectChatSession(plain);
}

export function projectChatSessionFromJsonWithState(
  data: ProjectChatSessionJsonState,
): ProjectChatSession {
  const projectChatSession = projectChatSessionFromJson(data.data);
  projectChatSession.setPgState(data.state);

  return projectChatSession;
}

export function projectChatSessionToPg(
  projectChatSession: ProjectChatSession,
): ProjectChatSessionPg {
  return {
    id: projectChatSession.id,
    created_at: toISO(projectChatSession.createdAt),
    user_id: projectChatSession.userId,
    project_id: projectChatSession.projectId,
    latest_chat_log_id: projectChatSession.latestChatLogId,
  };
}

export function projectChatSessionToPlain(
  projectChatSession: ProjectChatSession,
): ProjectChatSessionPlain {
  return {
    id: projectChatSession.id,
    createdAt: projectChatSession.createdAt,
    userId: projectChatSession.userId,
    projectId: projectChatSession.projectId,
    latestChatLogId: projectChatSession.latestChatLogId,
  };
}

export function projectChatSessionToJson(
  projectChatSession: ProjectChatSession,
): ProjectChatSessionJson {
  return {
    id: projectChatSession.id,
    createdAt: toISO(projectChatSession.createdAt),
    userId: projectChatSession.userId,
    projectId: projectChatSession.projectId,
    latestChatLogId: projectChatSession.latestChatLogId,
  };
}

export function projectChatSessionToJsonWithState(
  projectChatSession: ProjectChatSession,
): ProjectChatSessionJsonState {
  return {
    data: projectChatSessionToJson(projectChatSession),
    state: projectChatSession.pgState,
  };
}

export function projectChatSessionToResponse(
  projectChatSession: ProjectChatSession,
): ProjectChatSessionResponse {
  return {
    id: projectChatSession.id,
    createdAt: toISO(projectChatSession.createdAt),
  };
}

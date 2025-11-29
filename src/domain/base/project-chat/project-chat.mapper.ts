import { toDate, toISO } from '@shared/common/common.transformer';

import { ProjectChat } from './project-chat.domain';
import type { ProjectChatResponse } from './project-chat.response';
import type {
  ProjectChatJson,
  ProjectChatPg,
  ProjectChatPlain,
} from './project-chat.type';

export function projectChatFromPg(pg: ProjectChatPg): ProjectChat {
  const plain: ProjectChatPlain = {
    id: pg.id,
    parentId: pg.parent_id,
    message: pg.message,
    createdAt: toDate(pg.created_at),
    projectId: pg.project_id,
    chatSender: pg.chat_sender,
    userId: pg.user_id,
  };

  return new ProjectChat(plain);
}

export function projectChatFromPgWithState(pg: ProjectChatPg): ProjectChat {
  return projectChatFromPg(pg).setPgState(projectChatToPg);
}

export function projectChatFromPlain(plainData: ProjectChatPlain): ProjectChat {
  const plain: ProjectChatPlain = {
    id: plainData.id,
    parentId: plainData.parentId,
    message: plainData.message,
    createdAt: toDate(plainData.createdAt),
    projectId: plainData.projectId,
    chatSender: plainData.chatSender,
    userId: plainData.userId,
  };

  return new ProjectChat(plain);
}

export function projectChatFromJson(json: ProjectChatJson): ProjectChat {
  const plain: ProjectChatPlain = {
    id: json.id,
    parentId: json.parentId,
    message: json.message,
    createdAt: toDate(json.createdAt),
    projectId: json.projectId,
    chatSender: json.chatSender,
    userId: json.userId,
  };

  return new ProjectChat(plain);
}

export function projectChatToPg(domain: ProjectChat): ProjectChatPg {
  return {
    id: domain.id,
    parent_id: domain.parentId,
    chat_sender: domain.chatSender,
    created_at: toISO(domain.createdAt),
    project_id: domain.projectId,
    user_id: domain.userId,
    message: domain.message,
  };
}

export function projectChatToPlain(domain: ProjectChat): ProjectChatPlain {
  return {
    id: domain.id,
    parentId: domain.parentId,
    message: domain.message,
    createdAt: domain.createdAt,
    projectId: domain.projectId,
    chatSender: domain.chatSender,
    userId: domain.userId,
  };
}

export function projectChatToJson(domain: ProjectChat): ProjectChatJson {
  return {
    id: domain.id,
    parentId: domain.parentId,
    message: domain.message,
    createdAt: toISO(domain.createdAt),
    projectId: domain.projectId,
    chatSender: domain.chatSender,
    userId: domain.userId,
  };
}

export function projectChatToResponse(
  domain: ProjectChat,
): ProjectChatResponse {
  return {
    id: domain.id,
    message: domain.message,
    createdAt: toISO(domain.createdAt),
    chatSender: domain.chatSender,
  };
}

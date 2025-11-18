import { toDate, toISO } from '@shared/common/common.transformer';

import { ProjectChat } from './project-chat.domain';
import type { ProjectChatResponse } from './project-chat.response';
import type {
  ProjectChatJson,
  ProjectChatPg,
  ProjectChatPlain,
} from './types/project-chat.domain.type';

export class ProjectChatMapper {
  static fromPg(pg: ProjectChatPg): ProjectChat {
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

  static fromPgWithState(pg: ProjectChatPg): ProjectChat {
    return this.fromPg(pg).setPgState(this.toPg);
  }

  static fromPlain(plainData: ProjectChatPlain): ProjectChat {
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

  static fromJson(json: ProjectChatJson): ProjectChat {
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

  static toPg(domain: ProjectChat): ProjectChatPg {
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

  static toPlain(domain: ProjectChat): ProjectChatPlain {
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

  static toJson(domain: ProjectChat): ProjectChatJson {
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

  static toResponse(domain: ProjectChat): ProjectChatResponse {
    return {
      id: domain.id,
      message: domain.message,
      createdAt: toISO(domain.createdAt),
      chatSender: domain.chatSender,
    };
  }
}

import { ProjectChat } from './project-chat.domain';
import type { ProjectChatNewData } from './types/project-chat.domain.type';

export class ProjectChatFactory {
  static create(data: ProjectChatNewData): ProjectChat {
    return ProjectChat.new(data);
  }
}

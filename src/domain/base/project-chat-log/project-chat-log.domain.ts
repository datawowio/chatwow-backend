import type { ChatSender } from '@infra/db/db';

import { DomainEntity } from '@shared/common/common.domain';
import { isDefined } from '@shared/common/common.validator';

import type {
  ProjectChatLogPg,
  ProjectChatLogPlain,
  ProjectChatLogUpdateData,
} from './project-chat-log.type';

export class ProjectChatLog extends DomainEntity<ProjectChatLogPg> {
  readonly id: string;
  readonly createdAt: Date;
  readonly projectChatSessionId: string;
  readonly chatSender: ChatSender;
  readonly message: string;
  readonly parentId: string | null;

  constructor(plain: ProjectChatLogPlain) {
    super();
    Object.assign(this, plain);
  }

  edit(data: ProjectChatLogUpdateData) {
    const plain: ProjectChatLogPlain = {
      id: this.id,
      createdAt: this.createdAt,
      projectChatSessionId: this.projectChatSessionId,
      chatSender: this.chatSender,
      message: isDefined(data.message) ? data.message : this.message,
      parentId: isDefined(data.parentId) ? data.parentId : this.parentId,
    };

    Object.assign(this, plain);
  }
}

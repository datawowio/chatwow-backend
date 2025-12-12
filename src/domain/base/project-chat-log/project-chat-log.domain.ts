import type { ChatSender } from '@infra/db/db';

import { DomainEntity } from '@shared/common/common.domain';

import type {
  ProjectChatLogPg,
  ProjectChatLogPlain,
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
}

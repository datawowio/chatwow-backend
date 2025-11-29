import type { ChatSender } from '@infra/db/db';

import { DomainEntity } from '@shared/common/common.domain';

import type { ProjectChatPg, ProjectChatPlain } from './project-chat.type';

export class ProjectChat extends DomainEntity<ProjectChatPg> {
  readonly id: string;
  readonly createdAt: Date;
  readonly chatSender: ChatSender;
  readonly userId: string;
  readonly message: string;
  readonly projectId: string;
  readonly parentId: string | null;

  constructor(plain: ProjectChatPlain) {
    super();
    Object.assign(this, plain);
  }
}

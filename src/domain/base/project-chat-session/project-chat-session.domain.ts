import { DomainEntity } from '@shared/common/common.domain';
import { valueOr } from '@shared/common/common.func';

import type {
  ProjectChatSessionPg,
  ProjectChatSessionPlain,
  ProjectChatSessionUpdateData,
} from './project-chat-session.type';

export class ProjectChatSession extends DomainEntity<ProjectChatSessionPg> {
  readonly id: string;
  readonly createdAt: Date;
  readonly userId: string;
  readonly projectId: string;
  readonly latestChatLogId: string | null;

  constructor(plain: ProjectChatSessionPlain) {
    super();
    Object.assign(this, plain);
  }

  edit(data: ProjectChatSessionUpdateData) {
    const plain: ProjectChatSessionPlain = {
      id: this.id,
      createdAt: this.createdAt,
      userId: this.userId,
      projectId: this.projectId,

      latestChatLogId: valueOr(data.latestChatLogId, this.latestChatLogId),
    };

    Object.assign(this, plain);
  }
}

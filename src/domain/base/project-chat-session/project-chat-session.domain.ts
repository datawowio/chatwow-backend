import { SessionStatus } from '@infra/db/db';

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
  readonly initChatLogId: string | null;
  readonly sessionStatus: SessionStatus;

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

      sessionStatus: valueOr(data.sessionStatus, this.sessionStatus),
      latestChatLogId: valueOr(data.latestChatLogId, this.latestChatLogId),
      initChatLogId: this.initChatLogId
        ? this.initChatLogId
        : valueOr(data.initChatLogId, this.initChatLogId),
    };

    Object.assign(this, plain);
  }
}

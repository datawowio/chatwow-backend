import type { ChatSender } from '@infra/db/db';

import { uuidV7 } from '@shared/common/common.crypto';
import myDayjs from '@shared/common/common.dayjs';
import { DomainEntity } from '@shared/common/common.domain';
import { isDefined } from '@shared/common/common.validator';

import { ProjectChatMapper } from './project-chat.mapper';
import type {
  ProjectChatNewData,
  ProjectChatPg,
  ProjectChatPlain,
} from './types/project-chat.domain.type';

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

  static new(data: ProjectChatNewData): ProjectChat {
    return ProjectChatMapper.fromPlain({
      id: uuidV7(),
      createdAt: myDayjs().toDate(),
      chatSender: data.chatSender,
      projectId: data.projectId,
      message: data.message,
      userId: data.userId,
      parentId: isDefined(data.parentId) ? data.parentId : null,
    });
  }
}

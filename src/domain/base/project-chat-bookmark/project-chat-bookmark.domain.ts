import { DomainEntity } from '@shared/common/common.domain';
import { isDefined } from '@shared/common/common.validator';

import {
  projectChatBookmarkFromPlain,
  projectChatBookmarkToPlain,
} from './project-chat-bookmark.mapper';
import type {
  ProjectChatBookmarkPg,
  ProjectChatBookmarkPlain,
  ProjectChatBookmarkUpdateData,
} from './project-chat-bookmark.type';

export class ProjectChatBookmark extends DomainEntity<ProjectChatBookmarkPg> {
  readonly id: string;
  readonly createdAt: Date;
  readonly bookmarkText: string;
  readonly createdById: string;
  readonly projectId: string;

  constructor(plain: ProjectChatBookmarkPlain) {
    super();
    Object.assign(this, plain);
  }

  edit({ data }: ProjectChatBookmarkUpdateData) {
    const plain: ProjectChatBookmarkPlain = {
      id: this.id,
      createdAt: this.createdAt,
      bookmarkText: isDefined(data.bookmarkText)
        ? data.bookmarkText
        : this.bookmarkText,
      createdById: this.createdById,
      projectId: this.projectId,
    };

    Object.assign(this, plain);
  }

  clone() {
    return projectChatBookmarkFromPlain(projectChatBookmarkToPlain(this));
  }
}

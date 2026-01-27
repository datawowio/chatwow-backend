import { faker } from '@faker-js/faker';

import { uuidV7 } from '@shared/common/common.crypto';
import myDayjs from '@shared/common/common.dayjs';
import { valueOr } from '@shared/common/common.func';

import type { ProjectChatBookmark } from './project-chat-bookmark.domain';
import { projectChatBookmarkFromPlain } from './project-chat-bookmark.mapper';
import type {
  ProjectChatBookmarkNewData,
  ProjectChatBookmarkPlain,
} from './project-chat-bookmark.type';

export function newProjectChatBookmark({
  actorId,
  data,
}: ProjectChatBookmarkNewData): ProjectChatBookmark {
  return projectChatBookmarkFromPlain({
    id: uuidV7(),
    createdAt: myDayjs().toDate(),
    bookmarkText: data.bookmarkText,
    createdById: actorId,
    projectId: data.projectId,
  });
}

export function newProjectChatBookmarks(data: ProjectChatBookmarkNewData[]) {
  return data.map((d) => newProjectChatBookmark(d));
}

export function mockProjectChatBookmark(
  data: Partial<ProjectChatBookmarkPlain>,
) {
  return projectChatBookmarkFromPlain({
    id: valueOr(data.id, uuidV7()),
    createdAt: valueOr(data.createdAt, myDayjs().toDate()),
    bookmarkText: valueOr(data.bookmarkText, faker.lorem.sentence()),
    createdById: valueOr(data.createdById, uuidV7()),
    projectId: valueOr(data.projectId, uuidV7()),
  });
}

export function mockProjectChatBookmarks(
  amount: number,
  data: Partial<ProjectChatBookmarkPlain>,
) {
  return Array(amount)
    .fill(0)
    .map(() => mockProjectChatBookmark(data));
}

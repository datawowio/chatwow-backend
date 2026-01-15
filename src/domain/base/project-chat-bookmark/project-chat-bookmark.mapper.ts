import {
  toDate,
  toISO,
  toResponseDate,
} from '@shared/common/common.transformer';

import { ProjectChatBookmark } from './project-chat-bookmark.domain';
import type { ProjectChatBookmarkResponse } from './project-chat-bookmark.response';
import type {
  ProjectChatBookmarkJson,
  ProjectChatBookmarkJsonState,
  ProjectChatBookmarkPg,
  ProjectChatBookmarkPlain,
} from './project-chat-bookmark.type';

export function projectChatBookmarkFromPg(
  pg: ProjectChatBookmarkPg,
): ProjectChatBookmark {
  const plain: ProjectChatBookmarkPlain = {
    id: pg.id,
    createdAt: toDate(pg.created_at),
    bookmarkText: pg.bookmark_text,
    createdById: pg.created_by_id,
    projectId: pg.project_id,
  };

  return new ProjectChatBookmark(plain);
}

export function projectChatBookmarkFromPgWithState(
  pg: ProjectChatBookmarkPg,
): ProjectChatBookmark {
  return projectChatBookmarkFromPg(pg).setPgState(projectChatBookmarkToPg);
}

export function projectChatBookmarkFromPlain(
  plainData: ProjectChatBookmarkPlain,
): ProjectChatBookmark {
  const plain: ProjectChatBookmarkPlain = {
    id: plainData.id,
    createdAt: plainData.createdAt,
    bookmarkText: plainData.bookmarkText,
    createdById: plainData.createdById,
    projectId: plainData.projectId,
  };

  return new ProjectChatBookmark(plain);
}

export function projectChatBookmarkFromJson(
  json: ProjectChatBookmarkJson,
): ProjectChatBookmark {
  const plain: ProjectChatBookmarkPlain = {
    id: json.id,
    createdAt: toDate(json.createdAt),
    bookmarkText: json.bookmarkText,
    createdById: json.createdById,
    projectId: json.projectId,
  };

  return new ProjectChatBookmark(plain);
}

export function projectChatBookmarkFromJsonState(
  jsonState: ProjectChatBookmarkJsonState,
) {
  const domain = projectChatBookmarkFromJson(jsonState.data);
  domain.setPgState(jsonState.state);

  return domain;
}

export function projectChatBookmarkToPg(
  domain: ProjectChatBookmark,
): ProjectChatBookmarkPg {
  return {
    id: domain.id,
    created_at: toISO(domain.createdAt),
    bookmark_text: domain.bookmarkText,
    created_by_id: domain.createdById,
    project_id: domain.projectId,
  };
}

export function projectChatBookmarkToPlain(
  domain: ProjectChatBookmark,
): ProjectChatBookmarkPlain {
  return {
    id: domain.id,
    createdAt: domain.createdAt,
    bookmarkText: domain.bookmarkText,
    createdById: domain.createdById,
    projectId: domain.projectId,
  };
}

export function projectChatBookmarkToJson(
  domain: ProjectChatBookmark,
): ProjectChatBookmarkJson {
  return {
    id: domain.id,
    createdAt: toISO(domain.createdAt),
    bookmarkText: domain.bookmarkText,
    createdById: domain.createdById,
    projectId: domain.projectId,
  };
}

export function projectChatBookmarkToJsonState(
  domain: ProjectChatBookmark,
): ProjectChatBookmarkJsonState {
  return {
    state: domain.pgState,
    data: projectChatBookmarkToJson(domain),
  };
}

export function projectChatBookmarkToResponse(
  domain: ProjectChatBookmark,
): ProjectChatBookmarkResponse {
  return {
    id: domain.id,
    createdAt: toResponseDate(domain.createdAt),
    bookmarkText: domain.bookmarkText,
  };
}

export function projectChatBookmarkPgToResponse(
  pg: ProjectChatBookmarkPg,
): ProjectChatBookmarkResponse {
  return {
    id: pg.id,
    createdAt: toResponseDate(pg.created_at),
    bookmarkText: pg.bookmark_text,
  };
}

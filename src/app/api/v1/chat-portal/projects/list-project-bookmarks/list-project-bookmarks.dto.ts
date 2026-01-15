import { ProjectChatBookmarkResponse } from '@domain/base/project-chat-bookmark/project-chat-bookmark.response';
import {
  projectChatBookmarkFilterZod,
  projectChatBookmarkSortZod,
} from '@domain/base/project-chat-bookmark/project-chat-bookmark.zod';
import { ProjectResponse } from '@domain/base/project/project.response';
import { ApiProperty } from '@nestjs/swagger';
import z from 'zod';

import type { IDomainData } from '@shared/common/common.type';
import {
  PaginationMetaResponse,
  StandardResponse,
} from '@shared/http/http.response.dto';
import { paginationZod, zodDto } from '@shared/zod/zod.util';

import { listProjectChatBookmarkIncludesZod } from './list-project-bookmarks.util';

// ================ Request ================

const zod = z.object({
  includes: listProjectChatBookmarkIncludesZod,
  sort: projectChatBookmarkSortZod,
  filter: projectChatBookmarkFilterZod.optional(),
  countFilter: projectChatBookmarkFilterZod.optional(),
  pagination: paginationZod,
});

export class ListProjectBookmarksDto extends zodDto(zod) {}

// ================ Response ================

class ListProjectBookmarksProjectsData implements IDomainData {
  @ApiProperty({ type: () => ProjectResponse })
  attributes: ProjectResponse;
}

class ListProjectBookmarksProjectsRelations {
  @ApiProperty({ type: () => Object, nullable: true })
  project?: ListProjectBookmarksProjectsData;
}

export class ListProjectBookmarksBookmarkData implements IDomainData {
  @ApiProperty({ type: () => ProjectChatBookmarkResponse })
  attributes: ProjectChatBookmarkResponse;

  @ApiProperty({ type: () => ListProjectBookmarksProjectsRelations })
  relations: ListProjectBookmarksProjectsRelations;
}

export class ListProjectBookmarksData {
  @ApiProperty({ type: () => ListProjectBookmarksBookmarkData, isArray: true })
  projectChatBookmarks: ListProjectBookmarksBookmarkData[];
}

export class ListProjectBookmarksResponse extends StandardResponse {
  @ApiProperty({ type: () => ListProjectBookmarksData })
  data: ListProjectBookmarksData;

  @ApiProperty({ type: () => PaginationMetaResponse })
  meta: PaginationMetaResponse;
}

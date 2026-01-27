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

import { listProjectChatBookmarkIncludesZod } from './list-project-chat-bookmarks.util';

// ================ Request ================

const zod = z.object({
  includes: listProjectChatBookmarkIncludesZod,
  sort: projectChatBookmarkSortZod,
  filter: projectChatBookmarkFilterZod.optional(),
  countFilter: projectChatBookmarkFilterZod.optional(),
  pagination: paginationZod,
});

export class ListProjectChatBookmarksDto extends zodDto(zod) {}

// ================ Response ================

class ListProjectChatBookmarksProjectsData implements IDomainData {
  @ApiProperty({ type: () => ProjectResponse })
  attributes: ProjectResponse;
}

class ListProjectChatBookmarksProjectsRelations {
  @ApiProperty({ type: () => Object, nullable: true })
  project?: ListProjectChatBookmarksProjectsData;
}

export class ListProjectChatBookmarksBookmarkData implements IDomainData {
  @ApiProperty({ type: () => ProjectChatBookmarkResponse })
  attributes: ProjectChatBookmarkResponse;

  @ApiProperty({ type: () => ListProjectChatBookmarksProjectsRelations })
  relations: ListProjectChatBookmarksProjectsRelations;
}

export class ListProjectChatBookmarksData {
  @ApiProperty({
    type: () => ListProjectChatBookmarksBookmarkData,
    isArray: true,
  })
  projectChatBookmarks: ListProjectChatBookmarksBookmarkData[];
}

export class ListProjectChatBookmarksResponse extends StandardResponse {
  @ApiProperty({ type: () => ListProjectChatBookmarksData })
  data: ListProjectChatBookmarksData;

  @ApiProperty({ type: () => PaginationMetaResponse })
  meta: PaginationMetaResponse;
}

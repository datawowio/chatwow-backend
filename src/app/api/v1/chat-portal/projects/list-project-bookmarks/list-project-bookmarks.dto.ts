import { ProjectChatBookmarkResponse } from '@domain/base/project-chat-bookmark/project-chat-bookmark.response';
import {
  projectChatBookmarkFilterZod,
  projectChatBookmarkSortZod,
} from '@domain/base/project-chat-bookmark/project-chat-bookmark.zod';
import { ApiProperty } from '@nestjs/swagger';
import z from 'zod';

import type { IDomainData } from '@shared/common/common.type';
import {
  PaginationMetaResponse,
  StandardResponse,
} from '@shared/http/http.response.dto';
import { paginationZod, zodDto } from '@shared/zod/zod.util';

// ================ Request ================

const zod = z.object({
  sort: projectChatBookmarkSortZod,
  filter: projectChatBookmarkFilterZod.optional(),
  countFilter: projectChatBookmarkFilterZod.optional(),
  pagination: paginationZod,
});

export class ListProjectBookmarksDto extends zodDto(zod) {}

// ================ Response ================

export class ListProjectBookmarksProjectsData implements IDomainData {
  @ApiProperty({ type: () => ProjectChatBookmarkResponse })
  attributes: ProjectChatBookmarkResponse;

  @ApiProperty()
  relations: object;
}

export class ListProjectBookmarksData {
  @ApiProperty({ type: () => ListProjectBookmarksProjectsData, isArray: true })
  projectChatBookmarks: ListProjectBookmarksProjectsData[];
}

export class ListProjectBookmarksResponse extends StandardResponse {
  @ApiProperty({ type: () => ListProjectBookmarksData })
  data: ListProjectBookmarksData;

  @ApiProperty({ type: () => PaginationMetaResponse })
  meta: PaginationMetaResponse;
}

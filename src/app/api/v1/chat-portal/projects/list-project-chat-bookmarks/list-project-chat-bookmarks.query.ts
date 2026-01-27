import { projectChatBookmarkPgToResponse } from '@domain/base/project-chat-bookmark/project-chat-bookmark.mapper';
import { ProjectChatBookmarkService } from '@domain/base/project-chat-bookmark/project-chat-bookmark.service';
import { projectPgToResponse } from '@domain/base/project/project.mapper';
import { Injectable } from '@nestjs/common';

import { MainDb } from '@infra/db/db.main';
import { filterQbIds } from '@infra/db/db.util';
import { UserClaims } from '@infra/middleware/jwt/jwt.common';

import { getPagination } from '@shared/common/common.pagination';
import { QueryInterface } from '@shared/common/common.type';
import { toHttpSuccess } from '@shared/http/http.mapper';

import {
  ListProjectChatBookmarksDto,
  ListProjectChatBookmarksResponse,
} from './list-project-chat-bookmarks.dto';
import { listProjectChatBookmarkInclusionQb } from './list-project-chat-bookmarks.util';

@Injectable()
export class ListProjectChatBookmarksQuery implements QueryInterface {
  constructor(
    private db: MainDb,
    private projectChatBookmarkService: ProjectChatBookmarkService,
  ) {}

  async exec(
    claims: UserClaims,
    query: ListProjectChatBookmarksDto,
  ): Promise<ListProjectChatBookmarksResponse> {
    // default filter userId
    query.filter ??= {};
    query.countFilter ??= {};
    query.filter.createdById = claims.userId;
    query.countFilter.createdById = claims.userId;

    const { result, totalCount } = await this.getRaw(query);

    return toHttpSuccess({
      meta: {
        pagination: getPagination(result, totalCount, query.pagination),
      },
      data: {
        projectChatBookmarks: result.map((projectChatBookmark) => ({
          attributes: projectChatBookmarkPgToResponse(projectChatBookmark),
          relations: {
            project: projectChatBookmark.project
              ? {
                  attributes: projectPgToResponse(projectChatBookmark.project),
                }
              : undefined,
          },
        })),
      },
    });
  }

  async getRaw(query: ListProjectChatBookmarksDto) {
    const ids = await this.projectChatBookmarkService.getIds({
      filter: query.filter,
      sort: query.sort,
      pagination: query.pagination,
    });
    if (!ids) {
      return {
        result: [],
        totalCount: 0,
      };
    }

    const result = await this.db.read
      .selectFrom('project_chat_bookmarks')
      .$call((q) => listProjectChatBookmarkInclusionQb(q, query.includes))
      .selectAll()
      .$call((q) => filterQbIds(ids, q, 'project_chat_bookmarks.id'))
      .execute();

    const totalCount = await this.projectChatBookmarkService.getCount(
      query.countFilter,
    );

    return {
      result,
      totalCount,
    };
  }
}

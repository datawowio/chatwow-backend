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
  ListProjectBookmarksDto,
  ListProjectBookmarksResponse,
} from './list-project-bookmarks.dto';

@Injectable()
export class ListProjectBookmarksQuery implements QueryInterface {
  constructor(
    private db: MainDb,
    private projectChatBookmarkService: ProjectChatBookmarkService,
  ) {}

  async exec(
    claims: UserClaims,
    query: ListProjectBookmarksDto,
  ): Promise<ListProjectBookmarksResponse> {
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
        projects: result.map((project) => ({
          attributes: projectPgToResponse(project),
          relations: {},
        })),
      },
    });
  }

  async getRaw(query: ListProjectBookmarksDto) {
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
      .selectFrom('projects')
      .selectAll()
      .$call((q) => filterQbIds(ids, q, 'projects.id'))
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

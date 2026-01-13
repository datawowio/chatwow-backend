import { projectPgToResponse } from '@domain/base/project/project.mapper';
import { ProjectService } from '@domain/base/project/project.service';
import { Injectable } from '@nestjs/common';

import { MainDb } from '@infra/db/db.main';
import { filterQbIds } from '@infra/db/db.util';
import { UserClaims } from '@infra/middleware/jwt/jwt.common';

import { getPagination } from '@shared/common/common.pagination';
import { QueryInterface } from '@shared/common/common.type';
import { toHttpSuccess } from '@shared/http/http.mapper';

import {
  ListProjectChatSessionsDto,
  ListProjectChatSessionsResponse,
} from './list-project-chat-sessions.dto';

@Injectable()
export class ListProjectChatSessionsQuery implements QueryInterface {
  constructor(
    private db: MainDb,
    private projectsService: ProjectService,
  ) {}

  async exec(
    claims: UserClaims,
    query: ListProjectChatSessionsDto,
  ): Promise<ListProjectChatSessionsResponse> {
    // default filter userId
    query.filter ??= {};
    query.filter.userId = claims.userId;
    query.countFilter ??= {};
    query.countFilter.userId = claims.userId;

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

  async getRaw(query: ListProjectChatSessionsDto) {
    const ids = await this.projectsService.getIds({
      options: {
        filter: query.filter,
        sort: query.sort,
        pagination: query.pagination,
      },
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

    const totalCount = await this.projectsService.getCount({
      filter: query.countFilter,
    });

    return {
      result,
      totalCount,
    };
  }
}

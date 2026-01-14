import { projectChatLogPgToResponse } from '@domain/base/project-chat-log/project-chat-log.mapper';
import { projectChatSessionPgToResponse } from '@domain/base/project-chat-session/project-chat-session.mapper';
import { ProjectChatSessionService } from '@domain/base/project-chat-session/project-chat-session.service';
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
import { listProjectChatSessionInclusionQb } from './list-project-chat-sessions.util';

@Injectable()
export class ListProjectChatSessionsQuery implements QueryInterface {
  constructor(
    private db: MainDb,
    private projectChatSessionService: ProjectChatSessionService,
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
        projectChatSessions: result.map((projectChatSession) => ({
          attributes: projectChatSessionPgToResponse(projectChatSession),
          relations: {
            initChatLog: projectChatSession.initChatLog
              ? {
                  attributes: projectChatLogPgToResponse(
                    projectChatSession.initChatLog,
                  ),
                }
              : undefined,
            latestChatLog: projectChatSession.latestChatLog
              ? {
                  attributes: projectChatLogPgToResponse(
                    projectChatSession.latestChatLog,
                  ),
                }
              : undefined,
          },
        })),
      },
    });
  }

  async getRaw(query: ListProjectChatSessionsDto) {
    const ids = await this.projectChatSessionService.getIds({
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
      .selectFrom('project_chat_sessions')
      .$call((q) => listProjectChatSessionInclusionQb(q, query.includes))
      .selectAll()
      .$call((q) => filterQbIds(ids, q, 'project_chat_sessions.id'))
      .execute();

    const totalCount = await this.projectChatSessionService.getCount(
      query.countFilter,
    );

    return {
      result,
      totalCount,
    };
  }
}

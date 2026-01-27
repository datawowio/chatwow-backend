import { projectChatLogPgToResponse } from '@domain/base/project-chat-log/project-chat-log.mapper';
import { projectChatSessionPgToResponse } from '@domain/base/project-chat-session/project-chat-session.mapper';
import { ProjectChatSessionService } from '@domain/base/project-chat-session/project-chat-session.service';
import { Injectable } from '@nestjs/common';

import { MainDb } from '@infra/db/db.main';
import { filterQbIds } from '@infra/db/db.util';
import { UserClaims } from '@infra/middleware/jwt/jwt.common';

import { decodeCursor } from '@shared/common/common.crypto';
import {
  buildNextCursor,
  overrideQueryWithCursor,
} from '@shared/common/common.cursor';
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
    projectId: string,
    query: ListProjectChatSessionsDto,
  ): Promise<ListProjectChatSessionsResponse> {
    // default filter userId
    query.filter ??= {};
    query.sort ??= [['id', 'desc']];

    query.filter.userId = claims.userId;
    query.filter.projectId = projectId;

    overrideQueryWithCursor(query, decodeCursor(query.pagination?.cursor));

    const { result, nextCursor } = await this.getRaw(query);

    return toHttpSuccess({
      meta: {
        nextCursor,
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
      pagination: query.pagination,
    });
    if (!ids) {
      return {
        result: [],
        nextCursor: null,
      };
    }

    const result = await this.db.read
      .selectFrom('project_chat_sessions')
      .$call((q) => listProjectChatSessionInclusionQb(q, query.includes))
      .selectAll()
      .$call((q) => filterQbIds(ids, q, 'project_chat_sessions.id'))
      .execute();

    const nextCursor = buildNextCursor(result, query.sort, {
      id: {
        get: (d) => d.id,
        asc: 'idGt',
        desc: 'idLt',
      },
    });

    return {
      result,
      nextCursor,
    };
  }
}

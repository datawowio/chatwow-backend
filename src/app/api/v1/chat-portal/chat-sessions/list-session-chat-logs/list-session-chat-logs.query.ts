import { projectChatLogPgToResponse } from '@domain/base/project-chat-log/project-chat-log.mapper';
import { ProjectChatLogService } from '@domain/base/project-chat-log/project-chat-log.service';
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
  ListSessionChatLogsDto,
  ListSessionChatLogsResponse,
} from './list-session-chat-logs.dto';

@Injectable()
export class ListSessionChatLogsQuery implements QueryInterface {
  constructor(
    private db: MainDb,
    private projectChatLogService: ProjectChatLogService,
  ) {}

  async exec(
    claims: UserClaims,
    sessionId: string,
    query: ListSessionChatLogsDto,
  ): Promise<ListSessionChatLogsResponse> {
    query.filter ??= {};
    query.sort ??= [['id', 'desc']];
    query.filter.userId = claims.userId;
    query.filter.projectChatSessionId = sessionId;

    const decodedCursor = decodeCursor(query.pagination?.cursor);
    overrideQueryWithCursor(query, decodedCursor);

    const { result, nextCursor } = await this.getRaw(query);

    return toHttpSuccess({
      meta: {
        nextCursor,
      },
      data: {
        projectChatLogs: result.map((projectChatLog) => ({
          attributes: projectChatLogPgToResponse(projectChatLog),
          relations: {},
        })),
      },
    });
  }

  async getRaw(query: ListSessionChatLogsDto) {
    const ids = await this.projectChatLogService.getIds(query);
    if (!ids.length) {
      return {
        result: [],
        nextCursor: null,
      };
    }

    const result = await this.db.read
      .selectFrom('project_chat_logs')
      .selectAll()
      .$call((q) => filterQbIds(ids, q, 'project_chat_logs.id'))
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

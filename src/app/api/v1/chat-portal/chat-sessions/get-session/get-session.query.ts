import { projectChatSessionPgToResponse } from '@domain/base/project-chat-session/project-chat-session.mapper';
import { projectPgToResponse } from '@domain/base/project/project.mapper';
import { Injectable } from '@nestjs/common';

import { MainDb } from '@infra/db/db.main';
import { UserClaims } from '@infra/middleware/jwt/jwt.common';

import { QueryInterface } from '@shared/common/common.type';
import { ApiException } from '@shared/http/http.exception';
import { toHttpSuccess } from '@shared/http/http.mapper';

import { GetSessionDto, GetSessionResponse } from './get-session.dto';
import { getSessionInclusionQb } from './get-session.util';

@Injectable()
export class GetSessionQuery implements QueryInterface {
  constructor(private db: MainDb) {}

  async exec(
    claims: UserClaims,
    sessionId: string,
    query: GetSessionDto,
  ): Promise<GetSessionResponse> {
    const projectChatSession = await this.getRaw(claims, sessionId, query);

    return toHttpSuccess({
      data: {
        projectChatSession: {
          attributes: projectChatSessionPgToResponse(projectChatSession),
          relations: {
            project: projectChatSession.project
              ? {
                  attributes: projectPgToResponse(projectChatSession.project),
                }
              : undefined,
          },
        },
      },
    });
  }

  async getRaw(claims: UserClaims, sessionId: string, query: GetSessionDto) {
    const session = await this.db.read
      .selectFrom('project_chat_sessions')
      .where('project_chat_sessions.id', '=', sessionId)
      .where('project_chat_sessions.user_id', '=', claims.userId)
      .$call((q) => getSessionInclusionQb(q, query.includes))
      .selectAll()
      .executeTakeFirst();

    if (!session) {
      throw new ApiException(404, 'sessionNotFound');
    }

    return session;
  }
}

import { Injectable } from '@nestjs/common';

import { MainDb } from '@infra/db/db.main';
import { addPagination, queryCount, sortQb } from '@infra/db/db.util';
import { UserClaims } from '@infra/middleware/jwt/jwt.common';

import { diff, getUniqueIds } from '@shared/common/common.func';
import { isDefined } from '@shared/common/common.validator';

import { ProjectChatSession } from './project-chat-session.domain';
import {
  projectChatSessionFromPgWithState,
  projectChatSessionToPg,
} from './project-chat-session.mapper';
import { projectChatSessionsTableFilter } from './project-chat-session.util';
import {
  ProjectChatSessionFilterOptions,
  ProjectChatSessionQueryOptions,
} from './project-chat-session.zod';

@Injectable()
export class ProjectChatSessionService {
  constructor(private db: MainDb) {}

  async getIds(opts?: ProjectChatSessionQueryOptions) {
    opts ??= {};
    const { sort, pagination } = opts;

    const qb = await this._getFilterQb(opts.filter)
      .select('project_chat_sessions.id')
      .$if(!!sort?.length, (q) =>
        sortQb(q, opts!.sort, {
          id: 'project_chat_sessions.id',
          createdAt: 'project_chat_sessions.created_at',
        }),
      )
      .$call((q) => addPagination(q, pagination))
      .execute();

    return getUniqueIds(qb);
  }

  async getCount(filter?: ProjectChatSessionFilterOptions) {
    const totalCount = await this
      //
      ._getFilterQb(filter)
      .$call((q) => queryCount(q));

    return totalCount;
  }

  async findOne(id: string, claims?: UserClaims) {
    const projectChatSessionPg = await this.db.read
      .selectFrom('project_chat_sessions')
      .selectAll()
      .where('id', '=', id)
      .where(projectChatSessionsTableFilter)
      .$if(isDefined(claims), (q) =>
        q.where('project_chat_sessions.user_id', '=', claims!.userId),
      )
      .limit(1)
      .executeTakeFirst();

    if (!projectChatSessionPg) {
      return null;
    }

    return projectChatSessionFromPgWithState(projectChatSessionPg);
  }

  async findMany(ids: string[]) {
    const projectChatSessionPgs = await this.db.read
      .selectFrom('project_chat_sessions')
      .selectAll()
      .where('id', 'in', ids)
      .where(projectChatSessionsTableFilter)
      .execute();

    return projectChatSessionPgs.map((p) =>
      projectChatSessionFromPgWithState(p),
    );
  }

  async save(projectChatSession: ProjectChatSession) {
    this._validate(projectChatSession);

    if (!projectChatSession.isPersist) {
      await this._create(projectChatSession);
    } else {
      await this._update(projectChatSession.id, projectChatSession);
    }

    projectChatSession.setPgState(projectChatSessionToPg);
  }

  async saveBulk(projectChatSessions: ProjectChatSession[]) {
    return Promise.all(projectChatSessions.map((u) => this.save(u)));
  }

  async delete(id: string) {
    await this.db.write
      .deleteFrom('project_chat_sessions')
      .where('id', '=', id)
      .execute();
  }

  private _validate(_projectChatSession: ProjectChatSession) {
    // validation rules can be added here
  }

  private async _create(projectChatSession: ProjectChatSession) {
    await this.db.write
      .insertInto('project_chat_sessions')
      .values(projectChatSessionToPg(projectChatSession))
      .execute();
  }

  private _getFilterQb(filter?: ProjectChatSessionFilterOptions) {
    return this.db.read
      .selectFrom('project_chat_sessions')
      .select('project_chat_sessions.id')
      .where(projectChatSessionsTableFilter)
      .$if(isDefined(filter?.projectId), (q) =>
        q.where('project_chat_sessions.project_id', '=', filter!.projectId!),
      )
      .$if(!!filter?.projectIds?.length, (q) =>
        q.where('project_chat_sessions.project_id', 'in', filter!.projectIds!),
      )
      .$if(isDefined(filter?.userId), (q) =>
        q.where('project_chat_sessions.user_id', '=', filter!.userId!),
      )
      .$if(!!filter?.userIds?.length, (q) =>
        q.where('project_chat_sessions.user_id', 'in', filter!.userIds!),
      );
  }

  private async _update(id: string, projectChatSession: ProjectChatSession) {
    const data = diff(
      projectChatSession.pgState,
      projectChatSessionToPg(projectChatSession),
    );
    if (!data) return;

    await this.db.write
      .updateTable('project_chat_sessions')
      .set(data)
      .where('id', '=', id)
      .execute();
  }
}

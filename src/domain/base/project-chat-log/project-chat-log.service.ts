import { Injectable } from '@nestjs/common';

import { MainDb } from '@infra/db/db.main';
import { addPagination, queryCount, sortQb } from '@infra/db/db.util';

import { diff, getUniqueIds } from '@shared/common/common.func';
import { isDefined } from '@shared/common/common.validator';

import { ProjectChatLog } from './project-chat-log.domain';
import {
  projectChatLogFromPgWithState,
  projectChatLogToPg,
} from './project-chat-log.mapper';
import { projectChatLogsTableFilter } from './project-chat-log.util';
import {
  ProjectChatLogFilterOptions,
  ProjectChatLogQueryOptions,
} from './project-chat-log.zod';

@Injectable()
export class ProjectChatLogService {
  constructor(private db: MainDb) {}

  async getIds(opts?: ProjectChatLogQueryOptions) {
    opts ??= {};
    const { sort, pagination } = opts;

    const qb = await this._getFilterQb(opts.filter)
      .select('project_chat_logs.id')
      .$if(!!sort?.length, (q) =>
        sortQb(q, opts!.sort, {
          id: 'project_chat_logs.id',
          createdAt: 'project_chat_logs.created_at',
        }),
      )
      .$call((q) => addPagination(q, pagination))
      .execute();

    return getUniqueIds(qb);
  }

  async getCount(filter?: ProjectChatLogFilterOptions) {
    const totalCount = await this
      //
      ._getFilterQb(filter)
      .$call((q) => queryCount(q));

    return totalCount;
  }

  async findOne(id: string) {
    const projectChatLogPg = await this.db.read
      .selectFrom('project_chat_logs')
      .selectAll()
      .where('id', '=', id)
      .where(projectChatLogsTableFilter)
      .limit(1)
      .executeTakeFirst();

    if (!projectChatLogPg) {
      return null;
    }

    return projectChatLogFromPgWithState(projectChatLogPg);
  }

  async findMany(ids: string[]) {
    const projectChatLogPgs = await this.db.read
      .selectFrom('project_chat_logs')
      .selectAll()
      .where('id', 'in', ids)
      .where(projectChatLogsTableFilter)
      .execute();

    return projectChatLogPgs.map((p) => projectChatLogFromPgWithState(p));
  }

  async findAll() {
    const projectChatLogs = await this.db.read
      .selectFrom('project_chat_logs')
      .selectAll()
      .execute();

    return projectChatLogs.map((log) => projectChatLogFromPgWithState(log));
  }

  async save(projectChatLog: ProjectChatLog) {
    this._validate(projectChatLog);

    if (!projectChatLog.isPersist) {
      await this._create(projectChatLog);
    } else {
      await this._update(projectChatLog.id, projectChatLog);
    }

    projectChatLog.setPgState(projectChatLogToPg);
  }

  async saveBulk(projectChatLogs: ProjectChatLog[]) {
    return Promise.all(projectChatLogs.map((u) => this.save(u)));
  }

  async delete(id: string) {
    await this.db.write
      .deleteFrom('project_chat_logs')
      .where('id', '=', id)
      .execute();
  }

  private _validate(_projectChatLog: ProjectChatLog) {
    // validation rules can be added here
  }

  private async _create(projectChatLog: ProjectChatLog) {
    await this.db.write
      .insertInto('project_chat_logs')
      .values(projectChatLogToPg(projectChatLog))
      .execute();
  }

  private async _update(id: string, projectChatLog: ProjectChatLog) {
    const data = diff(
      projectChatLog.pgState,
      projectChatLogToPg(projectChatLog),
    );
    if (!data) return;

    await this.db.write
      .updateTable('project_chat_logs')
      .set(data)
      .where('id', '=', id)
      .execute();
  }

  private _getFilterQb(filter?: ProjectChatLogFilterOptions) {
    return this.db.read
      .selectFrom('project_chat_logs')
      .select('project_chat_logs.id')
      .where(projectChatLogsTableFilter)
      .$if(isDefined(filter?.userId), (q) =>
        q
          .leftJoin(
            'project_chat_sessions',
            'project_chat_sessions.id',
            'project_chat_logs.project_chat_session_id',
          )
          .where('project_chat_sessions.user_id', '=', filter!.userId!),
      )
      .$if(isDefined(filter?.projectChatSessionId), (q) =>
        q.where(
          'project_chat_logs.project_chat_session_id',
          '=',
          filter!.projectChatSessionId!,
        ),
      )
      .$if(!!filter?.projectChatSessionIds?.length, (q) =>
        q.where(
          'project_chat_logs.project_chat_session_id',
          'in',
          filter!.projectChatSessionIds!,
        ),
      )
      .$if(isDefined(filter?.chatSender), (q) =>
        q.where('project_chat_logs.chat_sender', '=', filter!.chatSender!),
      )
      .$if(!!filter?.chatSenders?.length, (q) =>
        q.where('project_chat_logs.chat_sender', 'in', filter!.chatSenders!),
      )
      .$if(isDefined(filter?.parentId), (q) =>
        q.where('project_chat_logs.parent_id', '=', filter!.parentId!),
      )
      .$if(isDefined(filter?.idGt), (q) =>
        q.where('project_chat_logs.id', '>', filter!.idGt!),
      )
      .$if(isDefined(filter?.idLt), (q) =>
        q.where('project_chat_logs.id', '<', filter!.idLt!),
      );
  }
}

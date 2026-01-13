import { Injectable } from '@nestjs/common';
import { Except } from 'type-fest';

import { getErrorKey } from '@infra/db/db.common';
import { MainDb } from '@infra/db/db.main';
import { addPagination, queryCount, sortQb } from '@infra/db/db.util';

import { diff, getUniqueIds } from '@shared/common/common.func';
import { isDefined } from '@shared/common/common.validator';
import { ApiException } from '@shared/http/http.exception';

import { ProjectChatBookmark } from './project-chat-bookmark.domain';
import {
  projectChatBookmarkFromPgWithState,
  projectChatBookmarkToPg,
} from './project-chat-bookmark.mapper';
import { projectChatBookmarksTableFilter } from './project-chat-bookmark.util';
import {
  ProjectChatBookmarkCountQueryOptions,
  ProjectChatBookmarkQueryOptions,
} from './project-chat-bookmark.zod';

@Injectable()
export class ProjectChatBookmarkService {
  constructor(private db: MainDb) {}

  async getIds(opts?: ProjectChatBookmarkQueryOptions) {
    opts ??= {};
    const { sort, pagination } = opts;

    const qb = await this._getFilterQb(opts)
      .select('project_chat_bookmarks.id')
      .$if(!!sort?.length, (q) =>
        sortQb(q, opts!.sort, {
          id: 'project_chat_bookmarks.id',
          createdAt: 'project_chat_bookmarks.created_at',
        }),
      )
      .$call((q) => addPagination(q, pagination))
      .execute();

    return getUniqueIds(qb);
  }

  async getCount(opts?: ProjectChatBookmarkCountQueryOptions) {
    const totalCount = await this
      //
      ._getFilterQb({
        filter: opts?.filter,
      })
      .$call((q) => queryCount(q));

    return totalCount;
  }

  async findOne(id: string) {
    const projectChatBookmarkPg = await this.db.read
      .selectFrom('project_chat_bookmarks')
      .selectAll()
      .where('id', '=', id)
      .where(projectChatBookmarksTableFilter)
      .limit(1)
      .executeTakeFirst();

    if (!projectChatBookmarkPg) {
      return null;
    }

    const projectChatBookmark = projectChatBookmarkFromPgWithState(
      projectChatBookmarkPg,
    );
    return projectChatBookmark;
  }

  async findMany(ids: string[]) {
    const projectChatBookmarkPgs = await this.db.read
      .selectFrom('project_chat_bookmarks')
      .selectAll()
      .where('id', 'in', ids)
      .where(projectChatBookmarksTableFilter)
      .execute();

    return projectChatBookmarkPgs.map((p) =>
      projectChatBookmarkFromPgWithState(p),
    );
  }

  async save(projectChatBookmark: ProjectChatBookmark) {
    this._validate(projectChatBookmark);

    if (!projectChatBookmark.isPersist) {
      await this._create(projectChatBookmark);
    } else {
      await this._update(projectChatBookmark.id, projectChatBookmark);
    }

    projectChatBookmark.setPgState(projectChatBookmarkToPg);
  }

  async saveBulk(projectChatBookmarks: ProjectChatBookmark[]) {
    return Promise.all(projectChatBookmarks.map((p) => this.save(p)));
  }

  async delete(id: string) {
    await this.db.write
      //
      .deleteFrom('project_chat_bookmarks')
      .where('id', '=', id)
      .execute();
  }

  private _validate(_projectChatBookmark: ProjectChatBookmark) {
    // validation rules can be added here
  }

  private async _create(projectChatBookmark: ProjectChatBookmark) {
    await this._tryWrite(async () =>
      this.db.write
        //
        .insertInto('project_chat_bookmarks')
        .values(projectChatBookmarkToPg(projectChatBookmark))
        .execute(),
    );
  }

  private async _update(id: string, projectChatBookmark: ProjectChatBookmark) {
    const data = diff(
      projectChatBookmark.pgState,
      projectChatBookmarkToPg(projectChatBookmark),
    );
    if (!data) {
      return;
    }

    await this._tryWrite(async () =>
      this.db.write
        //
        .updateTable('project_chat_bookmarks')
        .set(data)
        .where('id', '=', id)
        .execute(),
    );
  }

  private async _tryWrite<T>(cb: () => Promise<T>) {
    try {
      const data = await cb();
      return data;
    } catch (e: any) {
      const errKey = getErrorKey(e);
      if (errKey === 'exists') {
        throw new ApiException(409, 'alreadyExists');
      }

      throw new ApiException(500, 'internal');
    }
  }

  private _getFilterQb(
    opts?: Except<ProjectChatBookmarkQueryOptions, 'pagination'>,
  ) {
    const filter = opts?.filter;

    return this.db.read
      .selectFrom('project_chat_bookmarks')
      .select('project_chat_bookmarks.id')
      .where(projectChatBookmarksTableFilter)
      .$if(isDefined(filter?.projectId), (q) =>
        q.where('project_chat_bookmarks.project_id', '=', filter!.projectId!),
      )
      .$if(isDefined(filter?.createdById), (q) =>
        q.where(
          'project_chat_bookmarks.created_by_id',
          '=',
          filter!.createdById!,
        ),
      )
      .$if(isDefined(filter?.search), (q) => {
        const search = `%${filter!.search!}%`;

        return q.where((eb) =>
          eb.or([eb('project_chat_bookmarks.bookmark_text', 'ilike', search)]),
        );
      });
  }
}

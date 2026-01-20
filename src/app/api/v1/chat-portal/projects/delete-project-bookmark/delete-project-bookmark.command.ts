import { ProjectChatBookmark } from '@domain/base/project-chat-bookmark/project-chat-bookmark.domain';
import {
  projectChatBookmarkFromPgWithState,
  projectChatBookmarkToResponse,
} from '@domain/base/project-chat-bookmark/project-chat-bookmark.mapper';
import { ProjectChatBookmarkService } from '@domain/base/project-chat-bookmark/project-chat-bookmark.service';
import { projectChatBookmarksTableFilter } from '@domain/base/project-chat-bookmark/project-chat-bookmark.util';
import { Project } from '@domain/base/project/project.domain';
import {
  projectFromPgWithState,
  projectToResponse,
} from '@domain/base/project/project.mapper';
import { Injectable } from '@nestjs/common';
import { jsonObjectFrom } from 'kysely/helpers/postgres';

import { MainDb } from '@infra/db/db.main';
import { UserClaims } from '@infra/middleware/jwt/jwt.common';

import { CommandInterface } from '@shared/common/common.type';
import { ApiException } from '@shared/http/http.exception';
import { toHttpSuccess } from '@shared/http/http.mapper';

import { DeleteProjectBookmarkResponse } from './delete-project-bookmark.dto';

type Entity = {
  projectBookmark: ProjectChatBookmark;
  project: Project;
};

@Injectable()
export class DeleteProjectBookmarkCommand implements CommandInterface {
  constructor(
    private projectBookmarkService: ProjectChatBookmarkService,
    private db: MainDb,
  ) {}

  async exec(
    claims: UserClaims,
    projectId: string,
    projectBookmarkId: string,
  ): Promise<DeleteProjectBookmarkResponse> {
    const entity = await this.find(claims, projectId, projectBookmarkId);

    await this.projectBookmarkService.delete(entity.projectBookmark.id);

    return toHttpSuccess({
      data: {
        projectBookmark: {
          attributes: projectChatBookmarkToResponse(entity.projectBookmark),
          relations: {
            project: { attributes: projectToResponse(entity.project) },
          },
        },
      },
    });
  }

  async save(projectBookmark: ProjectChatBookmark): Promise<void> {
    await this.projectBookmarkService.save(projectBookmark);
  }

  async find(
    claims: UserClaims,
    projectId: string,
    projectBookmarkId: string,
  ): Promise<Entity> {
    const bookmark = await this.db.read
      .selectFrom('project_chat_bookmarks')
      .selectAll()
      .select((eb) =>
        jsonObjectFrom(
          eb
            .selectFrom('projects')
            .selectAll()
            .whereRef('projects.id', '=', 'project_chat_bookmarks.project_id'),
        ).as('project'),
      )
      .where('id', '=', projectBookmarkId)
      .where('project_id', '=', projectId)
      .where('created_by_id', '=', claims.userId)
      .where(projectChatBookmarksTableFilter)
      .executeTakeFirst();

    if (!bookmark || !bookmark.project) {
      throw new ApiException(404, 'projectBookmarkNotFound');
    }

    return {
      projectBookmark: projectChatBookmarkFromPgWithState(bookmark),
      project: projectFromPgWithState(bookmark.project),
    };
  }
}

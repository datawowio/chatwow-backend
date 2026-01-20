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

import { DeleteProjectChatBookmarkResponse } from './delete-project-chat-bookmark.dto';

type Entity = {
  projectChatBookmark: ProjectChatBookmark;
  project: Project;
};

@Injectable()
export class DeleteProjectChatBookmarkCommand implements CommandInterface {
  constructor(
    private projectChatBookmarkService: ProjectChatBookmarkService,
    private db: MainDb,
  ) {}

  async exec(
    claims: UserClaims,
    projectId: string,
    projectChatBookmarkId: string,
  ): Promise<DeleteProjectChatBookmarkResponse> {
    const entity = await this.find(claims, projectId, projectChatBookmarkId);

    await this.projectChatBookmarkService.delete(entity.projectChatBookmark.id);

    return toHttpSuccess({
      data: {
        projectChatBookmark: {
          attributes: projectChatBookmarkToResponse(entity.projectChatBookmark),
          relations: {
            project: { attributes: projectToResponse(entity.project) },
          },
        },
      },
    });
  }

  async save(projectChatBookmark: ProjectChatBookmark): Promise<void> {
    await this.projectChatBookmarkService.save(projectChatBookmark);
  }

  async find(
    claims: UserClaims,
    projectId: string,
    projectChatBookmarkId: string,
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
      .where('id', '=', projectChatBookmarkId)
      .where('project_id', '=', projectId)
      .where('created_by_id', '=', claims.userId)
      .where(projectChatBookmarksTableFilter)
      .executeTakeFirst();

    if (!bookmark || !bookmark.project) {
      throw new ApiException(404, 'projectChatBookmarkNotFound');
    }

    return {
      projectChatBookmark: projectChatBookmarkFromPgWithState(bookmark),
      project: projectFromPgWithState(bookmark.project),
    };
  }
}

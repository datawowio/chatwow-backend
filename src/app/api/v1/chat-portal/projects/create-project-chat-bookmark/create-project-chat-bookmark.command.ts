import { ProjectChatBookmark } from '@domain/base/project-chat-bookmark/project-chat-bookmark.domain';
import { newProjectChatBookmark } from '@domain/base/project-chat-bookmark/project-chat-bookmark.factory';
import { projectChatBookmarkToResponse } from '@domain/base/project-chat-bookmark/project-chat-bookmark.mapper';
import { ProjectChatBookmarkService } from '@domain/base/project-chat-bookmark/project-chat-bookmark.service';
import { Injectable } from '@nestjs/common';

import { UserClaims } from '@infra/middleware/jwt/jwt.common';

import { CommandInterface } from '@shared/common/common.type';
import { toHttpSuccess } from '@shared/http/http.mapper';

import {
  CreateProjectChatBookmarkDto,
  CreateProjectChatBookmarkResponse,
} from './create-project-chat-bookmark.dto';

@Injectable()
export class CreateProjectChatBookmarkCommand implements CommandInterface {
  constructor(private projectChatBookmarkService: ProjectChatBookmarkService) {}

  async exec(
    claims: UserClaims,
    projectId: string,
    body: CreateProjectChatBookmarkDto,
  ): Promise<CreateProjectChatBookmarkResponse> {
    const projectChatBookmark = newProjectChatBookmark({
      actorId: claims.userId,
      data: {
        projectId,
        bookmarkText: body.bookmarkText,
      },
    });

    await this.save(projectChatBookmark);

    return toHttpSuccess({
      data: {
        projectChatBookmark: {
          attributes: projectChatBookmarkToResponse(projectChatBookmark),
        },
      },
    });
  }

  async save(projectChatBookmark: ProjectChatBookmark): Promise<void> {
    await this.projectChatBookmarkService.save(projectChatBookmark);
  }
}

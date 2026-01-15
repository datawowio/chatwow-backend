import { ProjectChatBookmark } from '@domain/base/project-chat-bookmark/project-chat-bookmark.domain';
import { newProjectChatBookmark } from '@domain/base/project-chat-bookmark/project-chat-bookmark.factory';
import { projectChatBookmarkToResponse } from '@domain/base/project-chat-bookmark/project-chat-bookmark.mapper';
import { ProjectChatBookmarkService } from '@domain/base/project-chat-bookmark/project-chat-bookmark.service';
import { Injectable } from '@nestjs/common';

import { UserClaims } from '@infra/middleware/jwt/jwt.common';

import { CommandInterface } from '@shared/common/common.type';
import { toHttpSuccess } from '@shared/http/http.mapper';

import {
  CreateProjectBookmarkDto,
  CreateProjectBookmarkResponse,
} from './create-project-bookmark.dto';

@Injectable()
export class CreateProjectBookmarkCommand implements CommandInterface {
  constructor(private projectBookmarkService: ProjectChatBookmarkService) {}

  async exec(
    claims: UserClaims,
    projectId: string,
    body: CreateProjectBookmarkDto,
  ): Promise<CreateProjectBookmarkResponse> {
    const projectBookmark = newProjectChatBookmark({
      actorId: claims.userId,
      data: {
        projectId,
        bookmarkText: body.bookmarkText,
      },
    });

    await this.save(projectBookmark);

    return toHttpSuccess({
      data: {
        projectBookmark: {
          attributes: projectChatBookmarkToResponse(projectBookmark),
        },
      },
    });
  }

  async save(projectBookmark: ProjectChatBookmark): Promise<void> {
    await this.projectBookmarkService.save(projectBookmark);
  }
}

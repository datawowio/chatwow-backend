import {
  Body,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import { IdempotentContext } from '@infra/middleware/idempotent/idempotent.common';
import { UseIdempotent } from '@infra/middleware/idempotent/idempotent.interceptor';
import { UserClaims } from '@infra/middleware/jwt/jwt.common';

import { ChatPortalController } from '@shared/common/common.decorator';

import { CreateChatSessionCommand } from './create-chat-session/create-chat-session.command';
import { CreateChatSessionResponse } from './create-chat-session/create-chat-session.dto';
import { CreateProjectChatBookmarkCommand } from './create-project-chat-bookmark/create-project-chat-bookmark.command';
import {
  CreateProjectChatBookmarkDto,
  CreateProjectChatBookmarkResponse,
} from './create-project-chat-bookmark/create-project-chat-bookmark.dto';
import { DeleteProjectChatBookmarkCommand } from './delete-project-chat-bookmark/delete-project-chat-bookmark.command';
import { DeleteProjectChatBookmarkResponse } from './delete-project-chat-bookmark/delete-project-chat-bookmark.dto';
import {
  ListMyProjectsDto,
  ListMyProjectsResponse,
} from './list-my-projects/list-my-projects.dto';
import { ListMyProjectsQuery } from './list-my-projects/list-my-projects.query';
import {
  ListProjectChatBookmarksDto,
  ListProjectChatBookmarksResponse,
} from './list-project-chat-bookmarks/list-project-chat-bookmarks.dto';
import { ListProjectChatBookmarksQuery } from './list-project-chat-bookmarks/list-project-chat-bookmarks.query';
import {
  ListProjectChatQuestionRecommendationsDto,
  ListProjectChatQuestionRecommendationsResponse,
} from './list-project-chat-question-recommendations/list-project-chat-question-recommendations.dto';
import { ListProjectChatQuestionRecommendationsQuery } from './list-project-chat-question-recommendations/list-project-chat-question-recommendations.query';
import {
  ListProjectChatSessionsDto,
  ListProjectChatSessionsResponse,
} from './list-project-chat-sessions/list-project-chat-sessions.dto';
import { ListProjectChatSessionsQuery } from './list-project-chat-sessions/list-project-chat-sessions.query';

@ChatPortalController({ path: 'projects', version: '1' })
export class ProjectsV1Controller {
  constructor(
    private listMyProjectsQuery: ListMyProjectsQuery,
    private createChatSessionCommand: CreateChatSessionCommand,
    private listProjectChatSessionsQuery: ListProjectChatSessionsQuery,
    private listProjectChatBookmarksQuery: ListProjectChatBookmarksQuery,
    private listProjectChatQuestionRecommendationsQuery: ListProjectChatQuestionRecommendationsQuery,
    private createProjectChatBookmarkCommand: CreateProjectChatBookmarkCommand,
    private deleteProjectChatBookmarkCommand: DeleteProjectChatBookmarkCommand,
  ) {}

  @Get()
  @ApiResponse({ type: () => ListMyProjectsResponse })
  async getSelfProjects(
    @UserClaims() claims: UserClaims,
    @Query() query: ListMyProjectsDto,
  ): Promise<ListMyProjectsResponse> {
    return this.listMyProjectsQuery.exec(claims, query);
  }

  @Get('project-chat-bookmarks')
  @ApiResponse({ type: () => ListProjectChatBookmarksResponse })
  async getProjectChatBookmarks(
    @UserClaims() claims: UserClaims,
    @Query() query: ListProjectChatBookmarksDto,
  ): Promise<ListProjectChatBookmarksResponse> {
    return this.listProjectChatBookmarksQuery.exec(claims, query);
  }

  @Get('project-chat-question-recommendations')
  @ApiResponse({ type: () => ListProjectChatQuestionRecommendationsResponse })
  async getProjectChatQuestionRecommendations(
    @UserClaims() claims: UserClaims,
    @Query() query: ListProjectChatQuestionRecommendationsDto,
  ): Promise<ListProjectChatQuestionRecommendationsResponse> {
    return this.listProjectChatQuestionRecommendationsQuery.exec(claims, query);
  }

  @Post(':id/chat-sessions')
  @ApiResponse({
    type: () => CreateChatSessionResponse,
  })
  @UseIdempotent()
  async createChatSession(
    @IdempotentContext() idemCtx: IdempotentContext,
    @UserClaims() claims: UserClaims,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.createChatSessionCommand.exec(idemCtx, claims, id);
  }

  @Get(':id/chat-session/cursor')
  @ApiResponse({ type: () => ListProjectChatSessionsResponse })
  async getProjectChatSessions(
    @Param('id', ParseUUIDPipe) id: string,
    @UserClaims() claims: UserClaims,
    @Query() query: ListProjectChatSessionsDto,
  ): Promise<ListProjectChatSessionsResponse> {
    return this.listProjectChatSessionsQuery.exec(claims, id, query);
  }

  @Post(':id/project-chat-bookmarks')
  @ApiResponse({ type: () => CreateProjectChatBookmarkResponse })
  async createProjectChatBookmarks(
    @Param('id', ParseUUIDPipe) id: string,
    @UserClaims() claims: UserClaims,
    @Body() body: CreateProjectChatBookmarkDto,
  ): Promise<CreateProjectChatBookmarkResponse> {
    return this.createProjectChatBookmarkCommand.exec(claims, id, body);
  }

  @Delete(':projectId/project-chat-bookmarks/:id')
  @ApiResponse({ type: () => DeleteProjectChatBookmarkResponse })
  async deleteProjectChatBookmarks(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @UserClaims() claims: UserClaims,
  ): Promise<DeleteProjectChatBookmarkResponse> {
    return this.deleteProjectChatBookmarkCommand.exec(claims, projectId, id);
  }
}

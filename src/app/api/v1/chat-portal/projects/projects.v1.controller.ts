import {
  Controller,
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

import { CreateChatSessionCommand } from './create-chat-session/create-chat-session.command';
import { CreateChatSessionResponse } from './create-chat-session/create-chat-session.dto';
import {
  ListMyProjectsDto,
  ListMyProjectsResponse,
} from './list-my-projects/list-my-projects.dto';
import { ListMyProjectsQuery } from './list-my-projects/list-my-projects.query';
import {
  ListProjectBookmarksDto,
  ListProjectBookmarksResponse,
} from './list-project-bookmarks/list-project-bookmarks.dto';
import { ListProjectBookmarksQuery } from './list-project-bookmarks/list-project-bookmarks.query';
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

@Controller({ path: 'chat-portal/projects', version: '1' })
export class ProjectsV1Controller {
  constructor(
    private listMyProjectsQuery: ListMyProjectsQuery,
    private createChatSessionCommand: CreateChatSessionCommand,
    private listProjectChatSessionsQuery: ListProjectChatSessionsQuery,
    private listProjectBookmarksQuery: ListProjectBookmarksQuery,
    private listProjectChatQuestionRecommendationsQuery: ListProjectChatQuestionRecommendationsQuery,
  ) {}

  @Get()
  @ApiResponse({ type: () => ListMyProjectsResponse })
  async getSelfProjects(
    @UserClaims() claims: UserClaims,
    @Query() query: ListMyProjectsDto,
  ): Promise<ListMyProjectsResponse> {
    return this.listMyProjectsQuery.exec(claims, query);
  }

  @Post(':id/chat-session')
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

  @Get(':id/chat-session')
  @ApiResponse({ type: () => ListProjectChatSessionsResponse })
  async getProjectChatSessions(
    @Param('id', ParseUUIDPipe) id: string,
    @UserClaims() claims: UserClaims,
    @Query() query: ListProjectChatSessionsDto,
  ): Promise<ListProjectChatSessionsResponse> {
    return this.listProjectChatSessionsQuery.exec(claims, query);
  }

  @Get(':id/chat-bookmarks')
  @ApiResponse({ type: () => ListProjectBookmarksResponse })
  async getProjectChatBookmarks(
    @Param('id', ParseUUIDPipe) id: string,
    @UserClaims() claims: UserClaims,
    @Query() query: ListProjectBookmarksDto,
  ): Promise<ListProjectBookmarksResponse> {
    return this.listProjectBookmarksQuery.exec(claims, query);
  }

  @Get(':id/chat-question-recommendations')
  @ApiResponse({ type: () => ListProjectChatQuestionRecommendationsResponse })
  async getProjectChatQuestionRecommendations(
    @Param('id', ParseUUIDPipe) id: string,
    @UserClaims() claims: UserClaims,
    @Query() query: ListProjectChatQuestionRecommendationsDto,
  ): Promise<ListProjectChatQuestionRecommendationsResponse> {
    return this.listProjectChatQuestionRecommendationsQuery.exec(query);
  }
}

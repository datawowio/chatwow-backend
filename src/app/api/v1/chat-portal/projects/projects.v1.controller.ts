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

@Controller({ path: 'chat-portal/projects', version: '1' })
export class ProjectsV1Controller {
  constructor(
    private listMyProjectsQuery: ListMyProjectsQuery,
    private createChatSessionCommand: CreateChatSessionCommand,
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
}

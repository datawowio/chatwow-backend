import { Body, Get, Param, ParseUUIDPipe, Post, Query } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import { UserClaims } from '@infra/middleware/jwt/jwt.common';

import { ChatPortalController } from '@shared/common/common.decorator';

import {
  ListSessionChatLogsDto,
  ListSessionChatLogsResponse,
} from './list-session-chat-logs/list-session-chat-logs.dto';
import { ListSessionChatLogsQuery } from './list-session-chat-logs/list-session-chat-logs.query';
import { ProjectChatCommand } from './project-chat/project-chat.command';
import {
  ProjectChatDto,
  ProjectChatResponse,
} from './project-chat/project-chat.dto';

@ChatPortalController({ path: 'chat-sessions', version: '1' })
export class ChatSessionsV1Controller {
  constructor(
    //
    private projectChatCommand: ProjectChatCommand,
    private listSessionChatLogsQuery: ListSessionChatLogsQuery,
  ) {}

  @Post(':sessionId/chat')
  @ApiResponse({
    type: () => ProjectChatResponse,
  })
  async projectChat(
    @UserClaims() claims: UserClaims,
    @Param('sessionId', ParseUUIDPipe) sessionId: string,
    @Body() body: ProjectChatDto,
  ) {
    return this.projectChatCommand.exec(claims, sessionId, body);
  }

  @Get(':sessionId/chat-log/cursor')
  @ApiResponse({
    type: () => ListSessionChatLogsResponse,
  })
  async listSessionChatLogs(
    @Param('sessionId', ParseUUIDPipe) sessionId: string,
    @UserClaims() claims: UserClaims,
    @Query() query: ListSessionChatLogsDto,
  ): Promise<ListSessionChatLogsResponse> {
    return this.listSessionChatLogsQuery.exec(claims, sessionId, query);
  }
}

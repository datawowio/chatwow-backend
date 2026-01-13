import { Body, Controller, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import { UserClaims } from '@infra/middleware/jwt/jwt.common';

import { ProjectChatCommand } from './project-chat/project-chat.command';
import {
  ProjectChatDto,
  ProjectChatResponse,
} from './project-chat/project-chat.dto';

@Controller({ path: 'chat-sessions', version: '1' })
export class ChatSessionsV1Controller {
  constructor(
    //
    private projectChatCommand: ProjectChatCommand,
  ) {}

  @Post('me/:sessionId/chat')
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
}

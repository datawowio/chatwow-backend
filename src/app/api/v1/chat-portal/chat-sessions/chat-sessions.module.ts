import { Module } from '@nestjs/common';

import { ChatSessionsV1Controller } from './chat-sessions.controller';
import { ListSessionChatLogsQuery } from './list-session-chat-logs/list-session-chat-logs.query';
import { ProjectChatCommand } from './project-chat/project-chat.command';

@Module({
  providers: [ProjectChatCommand, ListSessionChatLogsQuery],
  controllers: [ChatSessionsV1Controller],
})
export class ChatSessionsV1Module {}

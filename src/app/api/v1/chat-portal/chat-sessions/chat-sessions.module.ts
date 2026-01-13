import { Module } from '@nestjs/common';

import { ChatSessionsV1Controller } from './chat-sessions.controller';
import { ProjectChatCommand } from './project-chat/project-chat.command';

@Module({
  providers: [ProjectChatCommand],
  controllers: [ChatSessionsV1Controller],
})
export class ChatSessionsV1Module {}

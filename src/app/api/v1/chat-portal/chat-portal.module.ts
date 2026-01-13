import { Module } from '@nestjs/common';

import { ChatSessionsV1Module } from './chat-sessions/chat-sessions.module';
import { ProjectsV1Module } from './projects/projects.v1.module';

@Module({
  imports: [ProjectsV1Module, ChatSessionsV1Module],
})
export class ChatPortalV1Module {}

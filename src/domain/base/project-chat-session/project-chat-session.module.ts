import { Module } from '@nestjs/common';

import { ProjectChatSessionService } from './project-chat-session.service';

@Module({
  providers: [ProjectChatSessionService],
  exports: [ProjectChatSessionService],
})
export class ProjectChatSessionModule {}

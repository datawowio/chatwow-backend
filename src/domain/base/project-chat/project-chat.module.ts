import { Module } from '@nestjs/common';

import { ProjectChatRepo } from './project-chat.repo';
import { ProjectChatService } from './project-chat.service';

@Module({
  providers: [ProjectChatService, ProjectChatRepo],
  exports: [ProjectChatService],
})
export class ProjectChatModule {}

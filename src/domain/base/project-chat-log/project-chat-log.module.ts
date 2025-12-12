import { Module } from '@nestjs/common';

import { ProjectChatLogService } from './project-chat-log.service';

@Module({
  providers: [ProjectChatLogService],
  exports: [ProjectChatLogService],
})
export class ProjectChatLogModule {}

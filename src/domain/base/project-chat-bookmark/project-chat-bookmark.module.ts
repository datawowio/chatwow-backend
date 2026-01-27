import { Module } from '@nestjs/common';

import { ProjectChatBookmarkService } from './project-chat-bookmark.service';

@Module({
  providers: [ProjectChatBookmarkService],
  exports: [ProjectChatBookmarkService],
})
export class ProjectChatBookmarkModule {}

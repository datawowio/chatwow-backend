import { Module } from '@nestjs/common';

import { CreateChatSessionCommand } from './create-chat-session/create-chat-session.command';
import { CreateProjectChatBookmarkCommand } from './create-project-chat-bookmark/create-project-chat-bookmark.command';
import { DeleteProjectChatBookmarkCommand } from './delete-project-chat-bookmark/delete-project-chat-bookmark.command';
import { ListMyProjectsQuery } from './list-my-projects/list-my-projects.query';
import { ListProjectChatBookmarksQuery } from './list-project-chat-bookmarks/list-project-chat-bookmarks.query';
import { ListProjectChatQuestionRecommendationsQuery } from './list-project-chat-question-recommendations/list-project-chat-question-recommendations.query';
import { ListProjectChatSessionsQuery } from './list-project-chat-sessions/list-project-chat-sessions.query';
import { ProjectsV1Controller } from './projects.v1.controller';

@Module({
  providers: [
    //
    CreateChatSessionCommand,
    ListMyProjectsQuery,
    ListProjectChatBookmarksQuery,
    ListProjectChatQuestionRecommendationsQuery,
    ListProjectChatSessionsQuery,
    CreateProjectChatBookmarkCommand,
    DeleteProjectChatBookmarkCommand,
  ],
  controllers: [ProjectsV1Controller],
})
export class ProjectsV1Module {}

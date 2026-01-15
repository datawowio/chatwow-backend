import { Module } from '@nestjs/common';

import { CreateChatSessionCommand } from './create-chat-session/create-chat-session.command';
import { CreateProjectBookmarkCommand } from './create-project-bookmark/create-project-bookmark.command';
import { ListMyProjectsQuery } from './list-my-projects/list-my-projects.query';
import { ListProjectBookmarksQuery } from './list-project-bookmarks/list-project-bookmarks.query';
import { ListProjectChatQuestionRecommendationsQuery } from './list-project-chat-question-recommendations/list-project-chat-question-recommendations.query';
import { ListProjectChatSessionsQuery } from './list-project-chat-sessions/list-project-chat-sessions.query';
import { ProjectsV1Controller } from './projects.v1.controller';

@Module({
  providers: [
    //
    CreateChatSessionCommand,
    ListMyProjectsQuery,
    ListProjectBookmarksQuery,
    ListProjectChatQuestionRecommendationsQuery,
    ListProjectChatSessionsQuery,
    CreateProjectBookmarkCommand,
  ],
  controllers: [ProjectsV1Controller],
})
export class ProjectsV1Module {}

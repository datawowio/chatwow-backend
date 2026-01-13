import { Module } from '@nestjs/common';

import { CreateChatSessionCommand } from './create-chat-session/create-chat-session.command';
import { CreateProjectCommand } from './create-project/create-project.command';
import { DeleteProjectCommand } from './delete-project/delete-project.command';
import { EditProjectCommand } from './edit-project/edit-project.command';
import { GetProjectQuery } from './get-project/get-project.query';
import { ListMyProjectsQuery } from './list-my-projects/list-my-projects.query';
import { ListProjectsQuery } from './list-projects/list-projects.query';
import { ProjectChatCommand } from './project-chat/project-chat.command';
import { ProjectsV1Controller } from './projects.v1.controller';
import { RegenerateProjectSummaryCommand } from './regenerate-project-summary/regenerate-project-summary.command';

@Module({
  providers: [
    ListProjectsQuery,
    ListMyProjectsQuery,
    GetProjectQuery,
    CreateProjectCommand,
    EditProjectCommand,
    RegenerateProjectSummaryCommand,
    CreateChatSessionCommand,
    DeleteProjectCommand,
    ProjectChatCommand,
  ],
  controllers: [ProjectsV1Controller],
})
export class ProjectsV1Module {}

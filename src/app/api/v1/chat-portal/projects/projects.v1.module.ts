import { Module } from '@nestjs/common';

import { CreateChatSessionCommand } from './create-chat-session/create-chat-session.command';
import { ListMyProjectsQuery } from './list-my-projects/list-my-projects.query';
import { ProjectsV1Controller } from './projects.v1.controller';

@Module({
  providers: [CreateChatSessionCommand, ListMyProjectsQuery],
  controllers: [ProjectsV1Controller],
})
export class ProjectsV1Module {}

import { Module } from '@nestjs/common';

import { CreateProjectCommand } from './create-project/create-project.command';
import { EditProjectCommand } from './edit-project/edit-project.command';
import { GetProjectQuery } from './get-project/get-project.query';
import { ListProjectsQuery } from './list-projects/list-projects.query';
import { ProjectsV1Controller } from './projects.v1.controller';
import { RegenerateProjectSummaryCommand } from './regenerate-project-summary/regenerate-project-summary.command';

@Module({
  providers: [
    ListProjectsQuery,
    GetProjectQuery,
    CreateProjectCommand,
    EditProjectCommand,
    RegenerateProjectSummaryCommand,
  ],
  controllers: [ProjectsV1Controller],
})
export class ProjectsV1Module {}

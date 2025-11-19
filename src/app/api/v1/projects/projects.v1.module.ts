import { Module } from '@nestjs/common';

import { GetProjectQuery } from './get-project/get-project.query';
import { ListProjectsQuery } from './list-projects/list-projects.query';
import { ProjectsV1Controller } from './projects.v1.controller';

@Module({
  providers: [ListProjectsQuery, GetProjectQuery],
  controllers: [ProjectsV1Controller],
})
export class ProjectsV1Module {}

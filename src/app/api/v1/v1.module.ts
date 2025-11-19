import { Module } from '@nestjs/common';

import { AuthV1Module } from './auth/auth.v1.module';
import { ProjectsV1Module } from './projects/projects.v1.module';
import { UsersV1Module } from './users/users.v1.module';

@Module({
  imports: [
    //
    AuthV1Module,
    UsersV1Module,
    ProjectsV1Module,
  ],
})
export class V1Module {}

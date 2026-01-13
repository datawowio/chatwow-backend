import { Module } from '@nestjs/common';

import { AnalyticsV1Module } from './analytics/analytics.v1.module';
import { AuthV1Module } from './auth/auth.v1.module';
import { ProjectDocumentsV1Module } from './project-documents/project-documents.v1.module';
import { ProjectsV1Module } from './projects/projects.v1.module';
import { UserGroupsV1Module } from './user-groups/user-groups.v1.module';
import { UsersV1Module } from './users/users.v1.module';

@Module({
  imports: [
    //
    AnalyticsV1Module,
    AuthV1Module,
    UsersV1Module,
    ProjectsV1Module,
    ProjectDocumentsV1Module,
    UserGroupsV1Module,
  ],
})
export class V1Module {}

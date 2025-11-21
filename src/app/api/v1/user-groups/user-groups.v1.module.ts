import { Module } from '@nestjs/common';

import { CreateUserGroupCommand } from './create-user-group/create-user-group.command';
import { EditUserGroupCommand } from './edit-user-group/edit-user-group.command';
import { GetUserGroupQuery } from './get-user-group/get-user-group.query';
import { ListUserGroupsQuery } from './list-user-groups/list-user-groups.query';
import { UserGroupsV1Controller } from './user-groups.v1.controller';

@Module({
  providers: [
    CreateUserGroupCommand,
    GetUserGroupQuery,
    EditUserGroupCommand,
    ListUserGroupsQuery,
  ],
  controllers: [UserGroupsV1Controller],
})
export class UserGroupsV1Module {}

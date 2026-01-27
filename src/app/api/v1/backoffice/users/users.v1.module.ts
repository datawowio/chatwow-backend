import { Module } from '@nestjs/common';

import { AddUserCommand } from './add-user/add-user.command';
import { CheckUserQuery } from './check-user/check-user.query';
import { DeleteUserCommand } from './delete-user/delete-user.command';
import { EditUserCommand } from './edit-user/edit-user.command';
import { GetUserQuery } from './get-user/get-user.query';
import { ListUsersQuery } from './list-users/list-users.query';
import { ResendInviteCommand } from './resend-invite/resend-invite.command';
import { UserSummaryQuery } from './user-summary/user-summary.query';
import { UsersV1Controller } from './users.v1.controller';

@Module({
  providers: [
    //
    AddUserCommand,
    CheckUserQuery,
    DeleteUserCommand,
    EditUserCommand,
    GetUserQuery,
    ListUsersQuery,
    ResendInviteCommand,
    UserSummaryQuery,
  ],
  controllers: [UsersV1Controller],
})
export class UsersV1Module {}

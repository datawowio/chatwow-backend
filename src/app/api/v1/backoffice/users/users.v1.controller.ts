import {
  Body,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import { UserClaims } from '@infra/middleware/jwt/jwt.common';
import { UseRoleGuard } from '@infra/middleware/role-guard/role.guard';

import { BackOfficeController } from '@shared/common/common.decorator';

import { AddUserCommand } from './add-user/add-user.command';
import { AddUserDto, AddUserResponse } from './add-user/add-user.dto';
import { CheckMeDto, CheckMeResponse } from './check-me/check-me.dto';
import { CheckMeQuery } from './check-me/check-me.query';
import { CheckUserDto, CheckUserResponse } from './check-user/check-user.dto';
import { CheckUserQuery } from './check-user/check-user.query';
import { DeleteUserCommand } from './delete-user/delete-user.command';
import { DeleteUserResponse } from './delete-user/delete-user.dto';
import { EditUserCommand } from './edit-user/edit-user.command';
import { EditUserDto, EditUserResponse } from './edit-user/edit-user.dto';
import { GetUserDto, GetUserResponse } from './get-user/get-user.dto';
import { GetUserQuery } from './get-user/get-user.query';
import { ListUsersDto, ListUsersResponse } from './list-users/list-users.dto';
import { ListUsersQuery } from './list-users/list-users.query';
import { ResendInviteCommand } from './resend-invite/resend-invite.command';
import { ResendInviteResponse } from './resend-invite/resend-invite.dto';
import { UpdateMeCommand } from './update-me/update-me.command';
import { UpdateMeDto, UpdateMeResponse } from './update-me/update-me.dto';
import {
  UserSummaryDto,
  UserSummaryResponse,
} from './user-summary/user-summary.dto';
import { UserSummaryQuery } from './user-summary/user-summary.query';

@BackOfficeController({ path: 'users', version: '1' })
export class UsersV1Controller {
  constructor(
    //
    private addUserCommand: AddUserCommand,
    private checkMeQuery: CheckMeQuery,
    private checkUserQuery: CheckUserQuery,
    private deleteUserCommand: DeleteUserCommand,
    private editUserCommand: EditUserCommand,
    private getUserQuery: GetUserQuery,
    private listUsersQuery: ListUsersQuery,
    private resendInviteCommand: ResendInviteCommand,
    private updateMeCommand: UpdateMeCommand,
    private userSummaryQuery: UserSummaryQuery,
  ) {}

  @Get()
  @UseRoleGuard(['ADMIN', 'MANAGER'])
  @ApiResponse({ type: () => ListUsersResponse })
  async getUsers(@Query() query: ListUsersDto) {
    return this.listUsersQuery.exec(query);
  }

  @Post()
  @UseRoleGuard(['ADMIN', 'MANAGER'])
  @ApiResponse({ type: () => AddUserResponse })
  async addUser(
    @UserClaims() claims: UserClaims,
    @Body() body: AddUserDto,
  ): Promise<AddUserResponse> {
    return this.addUserCommand.exec(claims, body);
  }

  @Get('summary')
  @UseRoleGuard(['ADMIN', 'MANAGER'])
  @ApiResponse({ type: () => UserSummaryResponse })
  async getUserSummary(
    @Query() query: UserSummaryDto,
  ): Promise<UserSummaryResponse> {
    return this.userSummaryQuery.exec(query);
  }

  @Get('check')
  @UseRoleGuard(['ADMIN', 'MANAGER'])
  @ApiResponse({ type: () => CheckUserResponse })
  async checkUser(@Query() query: CheckUserDto): Promise<CheckUserResponse> {
    return this.checkUserQuery.exec(query);
  }

  @Get('me')
  @ApiResponse({ type: () => GetUserResponse })
  async getSelf(
    @UserClaims() claims: UserClaims,
    @Query() query: GetUserDto,
  ): Promise<GetUserResponse> {
    return this.getUserQuery.exec(claims.userId, query);
  }

  @Patch('me')
  @ApiResponse({ type: () => UpdateMeResponse })
  async updateSelf(
    @UserClaims() claims: UserClaims,
    @Body() body: UpdateMeDto,
  ): Promise<UpdateMeResponse> {
    return this.updateMeCommand.exec(claims.userId, body);
  }

  @Post('me/check')
  @ApiResponse({ type: () => CheckMeResponse })
  async checkMe(
    @UserClaims() claims: UserClaims,
    @Body() body: CheckMeDto,
  ): Promise<CheckMeResponse> {
    return this.checkMeQuery.exec(claims.userId, body);
  }

  @Get(':id')
  @UseRoleGuard(['ADMIN', 'MANAGER'])
  @ApiResponse({ type: () => GetUserResponse })
  async getUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: GetUserDto,
  ): Promise<GetUserResponse> {
    return this.getUserQuery.exec(id, query);
  }

  @Patch(':id')
  @UseRoleGuard(['ADMIN', 'MANAGER'])
  @ApiResponse({ type: () => EditUserResponse })
  async editUser(
    @UserClaims() claims: UserClaims,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: EditUserDto,
  ): Promise<EditUserResponse> {
    return this.editUserCommand.exec(claims, id, body);
  }

  @Delete(':id')
  @UseRoleGuard(['ADMIN', 'MANAGER'])
  @ApiResponse({ type: () => DeleteUserResponse })
  async deleteUser(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<DeleteUserResponse> {
    return this.deleteUserCommand.exec(id);
  }

  @Post(':id/resend-invite')
  @UseRoleGuard(['ADMIN', 'MANAGER'])
  @ApiResponse({ type: () => ResendInviteResponse })
  async resendInvite(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ResendInviteResponse> {
    return this.resendInviteCommand.exec(id);
  }
}

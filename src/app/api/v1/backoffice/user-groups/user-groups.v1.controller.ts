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

import { BackOfficeController } from '@shared/common/common.decorator';

import { CreateUserGroupCommand } from './create-user-group/create-user-group.command';
import {
  CreateUserGroupDto,
  CreateUserGroupResponse,
} from './create-user-group/create-user-group.dto';
import { DeleteUserGroupCommand } from './delete-user-group/delete-user-group.command';
import { DeleteUserGroupResponse } from './delete-user-group/delete-user-group.dto';
import { EditUserGroupCommand } from './edit-user-group/edit-user-group.command';
import {
  EditUserGroupDto,
  EditUserGroupResponse,
} from './edit-user-group/edit-user-group.dto';
import {
  GetUserGroupDto,
  GetUserGroupResponse,
} from './get-user-group/get-user-group.dto';
import { GetUserGroupQuery } from './get-user-group/get-user-group.query';
import {
  ListUserGroupsDto,
  ListUserGroupsResponse,
} from './list-user-groups/list-user-groups.dto';
import { ListUserGroupsQuery } from './list-user-groups/list-user-groups.query';

@BackOfficeController({ path: 'user-groups', version: '1' })
export class UserGroupsV1Controller {
  constructor(
    private createUserGroupCommand: CreateUserGroupCommand,
    private getUserGroupQuery: GetUserGroupQuery,
    private editUserGroupCommand: EditUserGroupCommand,
    private listUserGroupsQuery: ListUserGroupsQuery,
    private deleteUserGroupCommand: DeleteUserGroupCommand,
  ) {}

  @Get()
  @ApiResponse({ type: () => ListUserGroupsResponse })
  async listUserGroups(
    @UserClaims() claims: UserClaims,
    @Query() query: ListUserGroupsDto,
  ) {
    return this.listUserGroupsQuery.exec(claims, query);
  }

  @Post()
  @ApiResponse({ type: () => CreateUserGroupResponse })
  async createUserGroup(
    @UserClaims() claims: UserClaims,
    @Body() body: CreateUserGroupDto,
  ) {
    return this.createUserGroupCommand.exec(claims, body);
  }

  @Get(':id')
  @ApiResponse({ type: () => GetUserGroupResponse })
  async getUserGroup(
    @UserClaims() claims: UserClaims,
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: GetUserGroupDto,
  ) {
    return this.getUserGroupQuery.exec(claims, id, query);
  }

  @Patch(':id')
  @ApiResponse({ type: () => EditUserGroupResponse })
  async editUserGroup(
    @UserClaims() claims: UserClaims,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: EditUserGroupDto,
  ) {
    return this.editUserGroupCommand.exec(claims, id, body);
  }

  @Delete(':id')
  @ApiResponse({ type: () => DeleteUserGroupResponse })
  async deleteUserGroup(
    @UserClaims() claims: UserClaims,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<DeleteUserGroupResponse> {
    return this.deleteUserGroupCommand.exec(claims, id);
  }
}

import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import { UserClaims } from '@infra/middleware/jwt/jwt.common';

import { CreateUserGroupCommand } from './create-user-group/create-user-group.command';
import {
  CreateUserGroupDto,
  CreateUserGroupResponse,
} from './create-user-group/create-user-group.dto';
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

@Controller({ path: 'user-groups', version: '1' })
export class UserGroupsV1Controller {
  constructor(
    private createUserGroupCommand: CreateUserGroupCommand,
    private getUserGroupQuery: GetUserGroupQuery,
    private editUserGroupCommand: EditUserGroupCommand,
    private listUserGroupsQuery: ListUserGroupsQuery,
  ) {}

  @Get()
  @ApiResponse({ type: () => ListUserGroupsResponse })
  async listUserGroups(@Query() query: ListUserGroupsDto) {
    return this.listUserGroupsQuery.exec(query);
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
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: GetUserGroupDto,
  ) {
    return this.getUserGroupQuery.exec(id, query);
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
}

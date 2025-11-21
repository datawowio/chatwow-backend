import { STORED_FILE_OWNER_TABLE } from '@domain/base/stored-file/stored-file.constant';
import { PresignUploadResponse } from '@domain/base/stored-file/stored-file.response';
import { StoredFileService } from '@domain/base/stored-file/stored-file.service';
import { GetPresignUploadUrlDto } from '@domain/base/stored-file/stored-file.zod';
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

import { CreateProjectCommand } from './create-project/create-project.command';
import {
  CreateProjectDto,
  CreateProjectResponse,
} from './create-project/create-project.dto';
import { EditProjectCommand } from './edit-project/edit-project.command';
import {
  EditProjectDto,
  EditProjectResponse,
} from './edit-project/edit-project.dto';
import {
  GetProjectDto,
  GetProjectResponse,
} from './get-project/get-project.dto';
import { GetProjectQuery } from './get-project/get-project.query';
import {
  ListProjectsDto,
  ListProjectsResponse,
} from './list-projects/list-projects.dto';
import { ListProjectsQuery } from './list-projects/list-projects.query';

@Controller({ path: 'projects', version: '1' })
export class ProjectsV1Controller {
  constructor(
    private listProjectsQuery: ListProjectsQuery,
    private getProjectsQuery: GetProjectQuery,
    private createProjectCommand: CreateProjectCommand,
    private storedFileService: StoredFileService,
    private editProjectCommand: EditProjectCommand,
  ) {}

  @Post()
  @ApiResponse({
    type: () => CreateProjectResponse,
  })
  async createProject(
    @UserClaims() claims: UserClaims,
    @Body() body: CreateProjectDto,
  ) {
    return this.createProjectCommand.exec(claims, body);
  }

  @Patch(':id')
  @ApiResponse({
    type: () => EditProjectResponse,
  })
  async editProject(
    @UserClaims() claims: UserClaims,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: EditProjectDto,
  ) {
    return this.editProjectCommand.exec(claims, id, body);
  }

  @Get()
  @ApiResponse({
    type: () => ListProjectsResponse,
  })
  async listUsers(@Query() query: ListProjectsDto) {
    return this.listProjectsQuery.exec(query);
  }

  @Get('presign-upload')
  @ApiResponse({
    type: () => PresignUploadResponse,
  })
  async getPresignUploadUrl(@Query() query: GetPresignUploadUrlDto) {
    return this.storedFileService.getPresignUploadUrlBulk(query.amount, {
      ownerTable: STORED_FILE_OWNER_TABLE.PROJECT_DOCUMENT,
      isPublic: false,
    });
  }

  @Get(':id')
  @ApiResponse({
    type: () => GetProjectResponse,
  })
  async getUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: GetProjectDto,
  ) {
    return this.getProjectsQuery.exec(id, query);
  }
}

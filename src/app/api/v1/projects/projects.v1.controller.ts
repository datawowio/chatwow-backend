import { STORED_FILE_OWNER_TABLE } from '@domain/base/stored-file/stored-file.constant';
import { PresignUploadResponse } from '@domain/base/stored-file/stored-file.response';
import { StoredFileService } from '@domain/base/stored-file/stored-file.service';
import { GetPresignUploadUrlDto } from '@domain/base/stored-file/stored-file.zod';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import { IdempotentContext } from '@infra/middleware/idempotent/idempotent.common';
import { UseIdempotent } from '@infra/middleware/idempotent/idempotent.interceptor';
import { UserClaims } from '@infra/middleware/jwt/jwt.common';

import { CreateChatSessionCommand } from './create-chat-session/create-chat-session.command';
import { CreateChatSessionResponse } from './create-chat-session/create-chat-session.dto';
import { CreateProjectCommand } from './create-project/create-project.command';
import {
  CreateProjectDto,
  CreateProjectResponse,
} from './create-project/create-project.dto';
import { DeleteProjectCommand } from './delete-project/delete-project.command';
import { DeleteProjectResponse } from './delete-project/delete-project.dto';
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
import { ProjectChatCommand } from './project-chat/project-chat.command';
import {
  ProjectChatDto,
  ProjectChatResponse,
} from './project-chat/project-chat.dto';
import { RegenerateProjectSummaryCommand } from './regenerate-project-summary/regenerate-project-summary.command';
import { RegenerateProjectSummaryResponse } from './regenerate-project-summary/regenerate-project-summary.dto';

@Controller({ path: 'projects', version: '1' })
export class ProjectsV1Controller {
  constructor(
    private listProjectsQuery: ListProjectsQuery,
    private getProjectsQuery: GetProjectQuery,
    private createProjectCommand: CreateProjectCommand,
    private storedFileService: StoredFileService,
    private editProjectCommand: EditProjectCommand,
    private deleteProjectCommand: DeleteProjectCommand,
    private regenerateProjectSummaryCommand: RegenerateProjectSummaryCommand,
    private createChatSessionCommand: CreateChatSessionCommand,
    private projectChatCommand: ProjectChatCommand,
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

  @Get()
  @ApiResponse({
    type: () => ListProjectsResponse,
  })
  async listUsers(
    @UserClaims() claims: UserClaims,
    @Query() query: ListProjectsDto,
  ) {
    return this.listProjectsQuery.exec(claims, query);
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

  @Get(':id')
  @ApiResponse({
    type: () => GetProjectResponse,
  })
  async getUser(
    @UserClaims() claims: UserClaims,
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: GetProjectDto,
  ) {
    return this.getProjectsQuery.exec(claims, id, query);
  }

  @Delete(':id')
  @ApiResponse({ type: () => DeleteProjectResponse })
  async deleteUser(
    @UserClaims() claims: UserClaims,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<DeleteProjectResponse> {
    return this.deleteProjectCommand.exec(claims, id);
  }

  @Post(':id/regenerate')
  @ApiResponse({
    type: () => RegenerateProjectSummaryResponse,
  })
  async regenerateSummary(
    @UserClaims() claims: UserClaims,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.regenerateProjectSummaryCommand.exec(claims, id);
  }

  @Post(':id/chat-session')
  @ApiResponse({
    type: () => CreateChatSessionResponse,
  })
  @UseIdempotent()
  async createChatSession(
    @IdempotentContext() idemCtx: IdempotentContext,
    @UserClaims() claims: UserClaims,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.createChatSessionCommand.exec(idemCtx, claims, id);
  }

  @Post(':id/chat-session/:sessionId/chat')
  @ApiResponse({
    type: () => ProjectChatResponse,
  })
  async projectChat(
    @UserClaims() claims: UserClaims,
    @Param('id', ParseUUIDPipe) id: string,
    @Param('sessionId', ParseUUIDPipe) sessionId: string,
    @Body() body: ProjectChatDto,
  ) {
    return this.projectChatCommand.exec(claims, id, sessionId, body);
  }
}

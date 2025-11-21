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

import { CreateProjectDocumentCommand } from './create-project-document/create-project-document.command';
import {
  CreateProjectDocumentDto,
  CreateProjectDocumentResponse,
} from './create-project-document/create-project-document.dto';
import { EditProjectDocumentCommand } from './edit-project-document/edit-project-document.command';
import {
  EditProjectDocumentDto,
  EditProjectDocumentResponse,
} from './edit-project-document/edit-project-document.dto';
import {
  GetProjectDocumentDto,
  GetProjectDocumentResponse,
} from './get-project-document/get-project-document.dto';
import { GetProjectDocumentQuery } from './get-project-document/get-project-document.query';
import {
  ListProjectDocumentsDto,
  ListProjectDocumentsResponse,
} from './list-project-documents/list-project-documents.dto';
import { ListProjectDocumentsQuery } from './list-project-documents/list-project-documents.query';

@Controller({ path: 'project-documents', version: '1' })
export class ProjectDocumentsV1Controller {
  constructor(
    private listProjectDocumentsQuery: ListProjectDocumentsQuery,
    private getProjectDocumentsQuery: GetProjectDocumentQuery,
    private createProjectDocumentCommand: CreateProjectDocumentCommand,
    private storedFileService: StoredFileService,
    private editProjectDocumentCommand: EditProjectDocumentCommand,
  ) {}

  @Post()
  @ApiResponse({
    type: () => CreateProjectDocumentResponse,
  })
  async createProject(
    @UserClaims() claims: UserClaims,
    @Body() body: CreateProjectDocumentDto,
  ) {
    return this.createProjectDocumentCommand.exec(claims, body);
  }

  @Patch(':id')
  @ApiResponse({
    type: () => EditProjectDocumentResponse,
  })
  async editProject(
    @UserClaims() claims: UserClaims,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: EditProjectDocumentDto,
  ) {
    return this.editProjectDocumentCommand.exec(claims, id, body);
  }

  @Get()
  @ApiResponse({
    type: () => ListProjectDocumentsResponse,
  })
  async listUsers(@Query() query: ListProjectDocumentsDto) {
    return this.listProjectDocumentsQuery.exec(query);
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
    type: () => GetProjectDocumentResponse,
  })
  async getUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: GetProjectDocumentDto,
  ) {
    return this.getProjectDocumentsQuery.exec(id, query);
  }
}

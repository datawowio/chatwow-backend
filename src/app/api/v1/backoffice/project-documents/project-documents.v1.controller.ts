import { STORED_FILE_OWNER_TABLE } from '@domain/base/stored-file/stored-file.constant';
import { PresignUploadResponse } from '@domain/base/stored-file/stored-file.response';
import { StoredFileService } from '@domain/base/stored-file/stored-file.service';
import { GetPresignUploadUrlDto } from '@domain/base/stored-file/stored-file.zod';
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

import { CreateProjectDocumentCommand } from './create-project-document/create-project-document.command';
import {
  CreateProjectDocumentDto,
  CreateProjectDocumentResponse,
} from './create-project-document/create-project-document.dto';
import { DeleteProjectDocumentCommand } from './delete-project-document/delete-project-document.command';
import { DeleteProjectDocumentResponse } from './delete-project-document/delete-project-document.dto';
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
import { RegenerateProjectDocumentSummaryCommand } from './regenerate-project-document-summary/regenerate-project-document-summary.command';
import { RegenerateProjectDocumentSummaryResponse } from './regenerate-project-document-summary/regenerate-project-document-summary.dto';

@BackOfficeController({ path: 'project-documents', version: '1' })
export class ProjectDocumentsV1Controller {
  constructor(
    private listProjectDocumentsQuery: ListProjectDocumentsQuery,
    private getProjectDocumentsQuery: GetProjectDocumentQuery,
    private createProjectDocumentCommand: CreateProjectDocumentCommand,
    private storedFileService: StoredFileService,
    private editProjectDocumentCommand: EditProjectDocumentCommand,
    private deleteProjectDocumentCommand: DeleteProjectDocumentCommand,
    private regenerateProjectDocumentCommand: RegenerateProjectDocumentSummaryCommand,
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

  @Get()
  @ApiResponse({
    type: () => ListProjectDocumentsResponse,
  })
  async listUsers(
    @UserClaims() claims: UserClaims,
    @Query() query: ListProjectDocumentsDto,
  ) {
    return this.listProjectDocumentsQuery.exec(claims, query);
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
    type: () => EditProjectDocumentResponse,
  })
  async editProject(
    @UserClaims() claims: UserClaims,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: EditProjectDocumentDto,
  ) {
    return this.editProjectDocumentCommand.exec(claims, id, body);
  }

  @Get(':id')
  @ApiResponse({
    type: () => GetProjectDocumentResponse,
  })
  async getUser(
    @UserClaims() claims: UserClaims,
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: GetProjectDocumentDto,
  ) {
    return this.getProjectDocumentsQuery.exec(claims, id, query);
  }

  @Delete(':id')
  @ApiResponse({ type: () => DeleteProjectDocumentResponse })
  async deleteUser(
    @UserClaims() claims: UserClaims,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<DeleteProjectDocumentResponse> {
    return this.deleteProjectDocumentCommand.exec(claims, id);
  }

  @Post(':id/regenerate')
  @ApiResponse({
    type: () => RegenerateProjectDocumentSummaryResponse,
  })
  async regenerateProjectDocument(
    @UserClaims() claims: UserClaims,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.regenerateProjectDocumentCommand.exec(claims, id);
  }
}

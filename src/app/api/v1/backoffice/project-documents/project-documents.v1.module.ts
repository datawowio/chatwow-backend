import { Module } from '@nestjs/common';

import { CreateProjectDocumentCommand } from './create-project-document/create-project-document.command';
import { DeleteProjectDocumentCommand } from './delete-project-document/delete-project-document.command';
import { EditProjectDocumentCommand } from './edit-project-document/edit-project-document.command';
import { GetProjectDocumentQuery } from './get-project-document/get-project-document.query';
import { ListProjectDocumentsQuery } from './list-project-documents/list-project-documents.query';
import { ProjectDocumentsV1Controller } from './project-documents.v1.controller';
import { RegenerateProjectDocumentSummaryCommand } from './regenerate-project-document-summary/regenerate-project-document-summary.command';

@Module({
  providers: [
    CreateProjectDocumentCommand,
    ListProjectDocumentsQuery,
    GetProjectDocumentQuery,
    EditProjectDocumentCommand,
    DeleteProjectDocumentCommand,
    RegenerateProjectDocumentSummaryCommand,
  ],
  controllers: [ProjectDocumentsV1Controller],
})
export class ProjectDocumentsV1Module {}

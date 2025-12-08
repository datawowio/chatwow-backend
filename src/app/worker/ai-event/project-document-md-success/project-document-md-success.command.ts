import { ProjectDocument } from '@domain/base/project-document/project-document.domain';
import { ProjectDocumentService } from '@domain/base/project-document/project-document.service';
import { AiFileService } from '@domain/logic/ai-file/ai-file.service';
import { Injectable } from '@nestjs/common';

import { CommandInterface } from '@shared/common/common.type';

import { ProjectDocumentMdSuccessData } from './project-document-md-success.type';

@Injectable()
export class ProjectDocumentMdSuccessCommand implements CommandInterface {
  constructor(
    //
    private aiFileService: AiFileService,
    private projectDocumentService: ProjectDocumentService,
  ) {}

  async exec(data: ProjectDocumentMdSuccessData) {
    const projectDocument = await this.find(data.projectDocumentId);

    const aiSummaryMd =
      await this.aiFileService.getProjectDocumentSummary(projectDocument);
    if (aiSummaryMd === null) {
      throw new Error('projectSummaryFileNotFound');
    }

    projectDocument.edit({
      data: {
        aiSummaryMd,
        documentStatus: 'ACTIVE',
      },
    });

    await this.save(projectDocument);
  }

  async find(projectDocumentId: string) {
    const projectDocument =
      await this.projectDocumentService.findOne(projectDocumentId);
    if (!projectDocument) {
      throw new Error('projectDocumentNotFound');
    }

    return projectDocument;
  }

  async save(projectDocument: ProjectDocument) {
    await this.projectDocumentService.save(projectDocument, {
      disableEvent: true,
    });
  }
}

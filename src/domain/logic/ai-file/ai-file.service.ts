import { ProjectDocument } from '@domain/base/project-document/project-document.domain';
import { Project } from '@domain/base/project/project.domain';
import { StoredFile } from '@domain/base/stored-file/stored-file.domain';
import { Injectable } from '@nestjs/common';

import { StorageService } from '@infra/global/storage/storage.service';

import { WriteProjectDocumentAiFileOpts } from './ai-file.type';
import {
  getProjectDocumentRawFileKeyPath,
  getProjectDocumentSummaryKeyPath,
  getProjectDocumentUserDescriptionKeyPath,
  getProjectSummaryKeyPath,
  getProjectUserDescriptionKeyPath,
} from './ai-file.util';

@Injectable()
export class AiFileService {
  constructor(private storageService: StorageService) {}

  async writeProjectAiFile(project: Project) {
    await Promise.all([
      this.writeProjectSummary(project),
      this.writeProjectUserDescription(project),
    ]);
  }

  async writeProjectSummary(project: Project) {
    const buffer = Buffer.from(project.aiSummaryMd, 'utf-8');
    const keyPath = getProjectSummaryKeyPath(project.id);

    await this.storageService.putBuffer(buffer, keyPath);
  }
  async writeProjectUserDescription(project: Project) {
    const buffer = Buffer.from(project.projectDescription, 'utf-8');
    const keyPath = getProjectUserDescriptionKeyPath(project.id);

    await this.storageService.putBuffer(buffer, keyPath);
  }

  async writeProjectDocumentAiFile({
    projectDocument,
    storedFile,
  }: WriteProjectDocumentAiFileOpts) {
    await Promise.all([
      this.writeProjectDocumentSummary(projectDocument),
      this.writeProjectDocumentUserDescription(projectDocument),
      this.writeProjectDocumentRawFile(projectDocument, storedFile),
    ]);
  }

  async writeProjectDocumentSummary(projectDocument: ProjectDocument) {
    const buffer = Buffer.from(projectDocument.aiSummaryMd, 'utf-8');
    const keyPath = getProjectDocumentSummaryKeyPath(
      projectDocument.projectId,
      projectDocument.id,
    );

    await this.storageService.putBuffer(buffer, keyPath);
  }
  async writeProjectDocumentUserDescription(projectDocument: ProjectDocument) {
    const buffer = Buffer.from(projectDocument.documentDetails, 'utf-8');
    const keyPath = getProjectDocumentUserDescriptionKeyPath(
      projectDocument.projectId,
      projectDocument.id,
    );

    await this.storageService.putBuffer(buffer, keyPath);
  }

  async writeProjectDocumentRawFile(
    projectDocument: ProjectDocument,
    storedFile: StoredFile,
  ) {
    const keyPath = getProjectDocumentRawFileKeyPath(
      projectDocument.projectId,
      projectDocument.id,
      storedFile.extension,
    );

    await this.storageService.copy(storedFile.keyPath, keyPath);
  }

  appendChatLogs() {}
}

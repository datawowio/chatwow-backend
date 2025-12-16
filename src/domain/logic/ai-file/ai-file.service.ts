import { ProjectDocument } from '@domain/base/project-document/project-document.domain';
import { Project } from '@domain/base/project/project.domain';
import { StoredFile } from '@domain/base/stored-file/stored-file.domain';
import { Injectable } from '@nestjs/common';

import { CacheService } from '@infra/global/cache/cache.service';
import { StorageService } from '@infra/global/storage/storage.service';

import { streamToBuffer } from '@shared/common/common.buffer';
import myDayjs from '@shared/common/common.dayjs';

import { AppendChatLogOpts, ChatJsonContent } from './ai-file.type';
import {
  getChatFileKeyPath,
  getProjectDocumentFolderPath,
  getProjectDocumentRawFileKeyPath,
  getProjectDocumentSummaryKeyPath,
  getProjectDocumentUserDescriptionKeyPath,
  getProjectFolderPath,
  getProjectSummaryKeyPath,
  getProjectUserDescriptionKeyPath,
} from './ai-file.util';

@Injectable()
export class AiFileService {
  constructor(
    private storageService: StorageService,
    private cacheService: CacheService,
  ) {}

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

  async deleteProjectAiFile(project: Project) {
    const keyPath = getProjectFolderPath(project.id);

    await this.storageService.deleteFolder(keyPath);
  }

  async getProjectSummary(project: Project): Promise<string | null> {
    const keyPath = getProjectSummaryKeyPath(project.id);
    const stream = await this.storageService.get(keyPath);
    if (!stream) {
      return null;
    }

    const buffer = await streamToBuffer(stream);
    return buffer.toString('utf-8');
  }

  async writeProjectUserDescription(project: Project) {
    const buffer = Buffer.from(project.projectDescription, 'utf-8');
    const keyPath = getProjectUserDescriptionKeyPath(project.id);

    await this.storageService.putBuffer(buffer, keyPath);
  }

  async writeProjectDocumentAiFile(projectDocument: ProjectDocument) {
    await Promise.all([
      this.writeProjectDocumentSummary(projectDocument),
      this.writeProjectDocumentUserDescription(projectDocument),
    ]);
  }

  async deleteProjectDocumentAiFile(projectDocument: ProjectDocument) {
    const keyPath = getProjectDocumentFolderPath(
      projectDocument.projectId,
      projectDocument.id,
    );

    await this.storageService.deleteFolder(keyPath);
  }

  async writeProjectDocumentSummary(projectDocument: ProjectDocument) {
    const buffer = Buffer.from(projectDocument.aiSummaryMd, 'utf-8');
    const keyPath = getProjectDocumentSummaryKeyPath(
      projectDocument.projectId,
      projectDocument.id,
    );

    await this.storageService.putBuffer(buffer, keyPath);
  }

  async getProjectDocumentSummary(
    projectDocument: ProjectDocument,
  ): Promise<string | null> {
    const keyPath = getProjectDocumentSummaryKeyPath(
      projectDocument.projectId,
      projectDocument.id,
    );
    const stream = await this.storageService.get(keyPath);
    if (!stream) {
      return null;
    }

    const buffer = await streamToBuffer(stream);
    return buffer.toString('utf-8');
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

  async appendChatLogs(opts: AppendChatLogOpts) {
    const keyPath = await this._getChatKeyPath(opts.sessionId);
    const content = await this._getChatContent(keyPath);

    opts.lineChatLogs.forEach((chatLog) => {
      content.logs.push({
        chat_sender: chatLog.chatSender,
        message: chatLog.message,
        created_at: myDayjs().toISOString(),
      });
    });

    await this._writeChatContent(keyPath, content);
  }

  private async _getChatContent(keyPath: string): Promise<ChatJsonContent> {
    const stream = await this.storageService.get(keyPath);
    if (!stream) {
      return {
        logs: [],
      };
    }

    const buffer = await streamToBuffer(stream);
    return JSON.parse(buffer.toString('utf8'));
  }

  private async _getChatKeyPath(sessionId: string) {
    const currentIndex = await this._getCurrentChatFileIndex(sessionId);
    let keyPath = getChatFileKeyPath(sessionId, currentIndex);

    const isFileTooLarge = await this._isChatFileTooLarge(keyPath);
    if (isFileTooLarge) {
      keyPath = getChatFileKeyPath(sessionId, currentIndex + 1);
      await this._setCurrentChatFileIndex(sessionId, currentIndex + 1);
    }

    return keyPath;
  }

  private async _writeChatContent(keyPath: string, content: ChatJsonContent) {
    const buffer = Buffer.from(JSON.stringify(content), 'utf-8');
    await this.storageService.putBuffer(buffer, keyPath);
  }

  private async _getCurrentChatFileIndex(sessionId: string) {
    const key = `chat-file:${sessionId}`;

    const index = await this.cacheService.get<number>(key);
    if (!index) {
      return 1;
    }

    return index as number;
  }

  private async _setCurrentChatFileIndex(sessionId: string, index: number) {
    const key = `chat-file:${sessionId}`;
    await this.cacheService.set(key, index.toString());
  }

  private async _isChatFileTooLarge(keyPath: string) {
    const maxSizeBytes = 32_000;

    try {
      const meta = await this.storageService.getObjectMeta(keyPath);
      if (!meta.sizeBytes) {
        return false;
      }

      return meta.sizeBytes >= maxSizeBytes;
    } catch {
      // not found return false
      return false;
    }
  }
}

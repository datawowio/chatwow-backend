import { AiFileService } from '@domain/logic/ai-file/ai-file.service';
import { Injectable } from '@nestjs/common';

import { SavedProjectDocumentData } from './saved-project-document.type';

@Injectable()
export class SavedProjectDocumentQueueCommand {
  constructor(private aiFileService: AiFileService) {}

  async exec(data: SavedProjectDocumentData) {
    await this.processAi(data);
  }

  async processAi(data: SavedProjectDocumentData) {
    await this.aiFileService.writeProjectDocumentAiFile(data);
  }
}

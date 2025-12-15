import { AiFileService } from '@domain/logic/ai-file/ai-file.service';
import { Injectable } from '@nestjs/common';

import { SavedProjectData } from './saved-project.type';

@Injectable()
export class SavedProjectQueueCommand {
  constructor(private aiFileService: AiFileService) {}

  async exec(data: SavedProjectData) {
    await this.processAi(data);
  }

  async processAi(data: SavedProjectData) {
    if (!data.isAiFieldUpdate) {
      return;
    }

    await this.aiFileService.writeProjectAiFile(data);
  }
}

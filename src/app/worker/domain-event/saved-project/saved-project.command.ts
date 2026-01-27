import { Project } from '@domain/base/project/project.domain';
import { AiFileService } from '@domain/logic/ai-file/ai-file.service';
import { Injectable } from '@nestjs/common';

import { MainDb } from '@infra/db/db.main';

@Injectable()
export class SavedProjectQueueCommand {
  constructor(
    private aiFileService: AiFileService,
    private db: MainDb,
  ) {}

  async exec(project: Project) {
    await this.processAi(project);
    await this.deprecateSessions(project);
  }

  async processAi(project: Project) {
    if (!project.hasUpdatedAiMemory) {
      return;
    }

    await this.aiFileService.writeProjectAiFile(project);
  }

  async deprecateSessions(project: Project) {
    if (!project.hasUpdatedAiMemory) {
      return;
    }

    await this.db.write
      .updateTable('project_chat_sessions')
      .set({ session_status: 'DEPRECATED' })
      .where('project_id', '=', project.id)
      .where('session_status', '=', 'ACTIVE')
      .execute();
  }
}

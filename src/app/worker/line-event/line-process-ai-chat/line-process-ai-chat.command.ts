import { projectDocumentFromPgWithState } from '@domain/base/project-document/project-document.mapper';
import { projectDocumentsTableFilter } from '@domain/base/project-document/project-document.util';
import { projectFromPgWithState } from '@domain/base/project/project.mapper';
import { projectsTableFilter } from '@domain/base/project/project.util';
import { STORED_FILE_REF_NAME } from '@domain/base/stored-file/stored-file.constant';
import { storedFileFromPgWithState } from '@domain/base/stored-file/stored-file.mapper';
import { AiApiService } from '@domain/logic/ai-api/ai-api.service';
import { AiApiEntity } from '@domain/logic/ai-api/ai-api.type';
import { Injectable } from '@nestjs/common';
import { jsonArrayFrom, jsonObjectFrom } from 'kysely/helpers/postgres';

import { MainDb } from '@infra/db/db.main';
import { LineService } from '@infra/global/line/line.service';

import { LineProcessAiChatJobData } from './line-process-ai-chat.type';

@Injectable()
export class LineProcessAiChatCommand {
  constructor(
    private db: MainDb,
    private aiApiService: AiApiService,
  ) {}

  async exec(body: LineProcessAiChatJobData) {
    const lineService = new LineService(body.lineBot);

    try {
      await this.process(lineService, body);
    } catch {
      await lineService.reply(
        body.replyToken,
        'ระบบขัดข้องโปรดลองใหม่อีกครั้ง',
      );
    }
  }

  async process(lineService: LineService, body: LineProcessAiChatJobData) {
    const entity = await this.find(body.lineSession.projectId);
    await this.aiApiService.chat({
      request: {
        content: '',
      },
      entity,
    });

    await lineService.reply(body.replyToken, 'สำเร็จ');
  }

  async find(projectId: string): Promise<AiApiEntity> {
    const raw = await this.db.read
      .selectFrom('projects')
      .selectAll('projects')
      .select((q) =>
        jsonArrayFrom(
          q
            .selectFrom('project_documents')
            .selectAll('project_documents')
            .where(projectDocumentsTableFilter)
            .select((q) =>
              jsonObjectFrom(
                q
                  .selectFrom('stored_files')
                  .selectAll()
                  .where('ref_name', '=', STORED_FILE_REF_NAME.DEFAULT)
                  .whereRef('owner_id', '=', 'project_documents.id'),
              ).as('storedFile'),
            )
            .whereRef('project_documents.project_id', '=', 'projects.id'),
        ).as('projectDocuments'),
      )
      .where(projectsTableFilter)
      .where('projects.id', '=', projectId)
      .executeTakeFirst();

    if (!raw) {
      throw new Error('project not found');
    }

    return {
      project: projectFromPgWithState(raw),
      relations: raw.projectDocuments.map((doc) => {
        if (!doc.storedFile) {
          throw new Error(`project document id:${doc.id} has no file`);
        }

        return {
          projectDocument: projectDocumentFromPgWithState(doc),
          storedFile: storedFileFromPgWithState(doc.storedFile),
        };
      }),
    };
  }
}

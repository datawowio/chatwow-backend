import { Injectable } from '@nestjs/common';

import { MainDb } from '@infra/db/db.main';

import { diff } from '@shared/common/common.func';

import { ProjectChatLog } from './project-chat-log.domain';
import {
  projectChatLogFromPgWithState,
  projectChatLogToPg,
} from './project-chat-log.mapper';

@Injectable()
export class ProjectChatLogService {
  constructor(private db: MainDb) {}

  async findOne(id: string) {
    const projectChatLogPg = await this.db.read
      .selectFrom('project_chat_logs')
      .selectAll()
      .where('id', '=', id)
      .limit(1)
      .executeTakeFirst();

    if (!projectChatLogPg) {
      return null;
    }

    return projectChatLogFromPgWithState(projectChatLogPg);
  }

  async save(projectChatLog: ProjectChatLog) {
    this._validate(projectChatLog);

    if (!projectChatLog.isPersist) {
      await this._create(projectChatLog);
    } else {
      await this._update(projectChatLog.id, projectChatLog);
    }

    projectChatLog.setPgState(projectChatLogToPg);
  }

  async saveBulk(projectChatLogs: ProjectChatLog[]) {
    return Promise.all(projectChatLogs.map((u) => this.save(u)));
  }

  async delete(id: string) {
    await this.db.write
      .deleteFrom('project_chat_logs')
      .where('id', '=', id)
      .execute();
  }

  private _validate(_projectChatLog: ProjectChatLog) {
    // validation rules can be added here
  }

  private async _create(projectChatLog: ProjectChatLog) {
    await this.db.write
      .insertInto('project_chat_logs')
      .values(projectChatLogToPg(projectChatLog))
      .execute();
  }

  private async _update(id: string, projectChatLog: ProjectChatLog) {
    const data = diff(
      projectChatLog.pgState,
      projectChatLogToPg(projectChatLog),
    );
    if (!data) return;

    await this.db.write
      .updateTable('project_chat_logs')
      .set(data)
      .where('id', '=', id)
      .execute();
  }
}

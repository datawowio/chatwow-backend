import { Injectable } from '@nestjs/common';

import { MainDb } from '@infra/db/db.main';

import { diff } from '@shared/common/common.func';

import { ProjectChat } from './project-chat.domain';
import {
  projectChatFromPgWithState,
  projectChatToPg,
} from './project-chat.mapper';

@Injectable()
export class ProjectChatService {
  constructor(private readonly db: MainDb) {}

  async findOne(id: string): Promise<ProjectChat | null> {
    const userPg = await this.db.read
      .selectFrom('project_chats')
      .selectAll()
      .where('id', '=', id)
      .limit(1)
      .executeTakeFirst();

    if (!userPg) {
      return null;
    }

    const domain = projectChatFromPgWithState(userPg);
    return domain;
  }

  async save(projectChat: ProjectChat) {
    this._validate(projectChat);

    if (!projectChat.isPersist) {
      await this._create(projectChat);
    } else {
      await this._update(projectChat.id, projectChat);
    }

    projectChat.setPgState(projectChatToPg);
  }

  async saveBulk(lineSessions: ProjectChat[]) {
    return Promise.all(lineSessions.map((u) => this.save(u)));
  }

  async delete(id: string) {
    await this.db.write
      //
      .deleteFrom('project_chats')
      .where('id', '=', id)
      .execute();
  }

  private async _create(domain: ProjectChat): Promise<void> {
    await this.db.write
      //
      .insertInto('project_chats')
      .values(projectChatToPg(domain))
      .execute();
  }

  private async _update(id: string, domain: ProjectChat): Promise<void> {
    const data = diff(domain.pgState, projectChatToPg(domain));
    if (!data) {
      return;
    }

    await this.db.write
      //
      .updateTable('project_chats')
      .set(data)
      .where('id', '=', id)
      .execute();
  }

  private _validate(_lineSession: ProjectChat) {
    // validation rules can be added here
  }
}

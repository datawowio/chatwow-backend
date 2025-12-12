import { Injectable } from '@nestjs/common';

import { MainDb } from '@infra/db/db.main';
import { UserClaims } from '@infra/middleware/jwt/jwt.common';

import { diff } from '@shared/common/common.func';
import { isDefined } from '@shared/common/common.validator';

import { ProjectChatSession } from './project-chat-session.domain';
import {
  projectChatSessionFromPgWithState,
  projectChatSessionToPg,
} from './project-chat-session.mapper';

@Injectable()
export class ProjectChatSessionService {
  constructor(private db: MainDb) {}

  async findOne(id: string, claims?: UserClaims) {
    const projectChatSessionPg = await this.db.read
      .selectFrom('project_chat_sessions')
      .selectAll()
      .where('id', '=', id)
      .$if(isDefined(claims), (q) =>
        q.where('project_chat_sessions.user_id', '=', claims!.userId),
      )
      .limit(1)
      .executeTakeFirst();

    if (!projectChatSessionPg) {
      return null;
    }

    return projectChatSessionFromPgWithState(projectChatSessionPg);
  }

  async save(projectChatSession: ProjectChatSession) {
    this._validate(projectChatSession);

    if (!projectChatSession.isPersist) {
      await this._create(projectChatSession);
    } else {
      await this._update(projectChatSession.id, projectChatSession);
    }

    projectChatSession.setPgState(projectChatSessionToPg);
  }

  async saveBulk(projectChatSessions: ProjectChatSession[]) {
    return Promise.all(projectChatSessions.map((u) => this.save(u)));
  }

  async delete(id: string) {
    await this.db.write
      .deleteFrom('project_chat_sessions')
      .where('id', '=', id)
      .execute();
  }

  private _validate(_projectChatSession: ProjectChatSession) {
    // validation rules can be added here
  }

  private async _create(projectChatSession: ProjectChatSession) {
    await this.db.write
      .insertInto('project_chat_sessions')
      .values(projectChatSessionToPg(projectChatSession))
      .execute();
  }

  private async _update(id: string, projectChatSession: ProjectChatSession) {
    const data = diff(
      projectChatSession.pgState,
      projectChatSessionToPg(projectChatSession),
    );
    if (!data) return;

    await this.db.write
      .updateTable('project_chat_sessions')
      .set(data)
      .where('id', '=', id)
      .execute();
  }
}

import { Injectable } from '@nestjs/common';

import { MainDb } from '@infra/db/db.main';

import { diff } from '@shared/common/common.func';

import { LineSession } from './line-session.domain';
import {
  lineSessionFromPgWithState,
  lineSessionToPg,
} from './line-session.mapper';

@Injectable()
export class LineSessionService {
  constructor(private db: MainDb) {}

  async findOne(id: string) {
    const lineSessionPg = await this.db.read
      .selectFrom('line_sessions')
      .selectAll()
      .where('id', '=', id)
      .limit(1)
      .executeTakeFirst();

    if (!lineSessionPg) {
      return null;
    }

    return lineSessionFromPgWithState(lineSessionPg);
  }

  async save(lineSession: LineSession) {
    this._validate(lineSession);

    if (!lineSession.isPersist) {
      await this._create(lineSession);
    } else {
      await this._update(lineSession.id, lineSession);
    }

    lineSession.setPgState(lineSessionToPg);
  }

  async saveBulk(lineSessions: LineSession[]) {
    return Promise.all(lineSessions.map((u) => this.save(u)));
  }

  async delete(id: string) {
    await this.db.write
      .deleteFrom('line_sessions')
      .where('id', '=', id)
      .execute();
  }

  private _validate(_lineSession: LineSession) {
    // validation rules can be added here
  }

  private async _create(lineSession: LineSession) {
    await this.db.write
      .insertInto('line_sessions')
      .values(lineSessionToPg(lineSession))
      .execute();
  }

  private async _update(id: string, lineSession: LineSession) {
    const data = diff(lineSession.pgState, lineSessionToPg(lineSession));
    if (!data) return;

    await this.db.write
      .updateTable('line_sessions')
      .set(data)
      .where('id', '=', id)
      .execute();
  }

  async inactiveAll(lineAccountId: string, lineBotId: string): Promise<void> {
    await this.db.write
      .updateTable('line_sessions')
      .set({ line_session_status: 'INACTIVE' })
      .where('line_account_id', '=', lineAccountId)
      .where('line_bot_id', '=', lineBotId)
      .execute();
  }
}

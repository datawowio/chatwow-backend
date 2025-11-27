import { Injectable } from '@nestjs/common';

import { diff } from '@shared/common/common.func';
import { BaseRepo } from '@shared/common/common.repo';

import { LineSession } from './line-session.domain';
import { LineSessionMapper } from './line-session.mapper';

@Injectable()
export class LineSessionRepo extends BaseRepo {
  async create(lineSession: LineSession): Promise<void> {
    await this.db
      .insertInto('line_sessions')
      .values(LineSessionMapper.toPg(lineSession))
      .execute();
  }

  async update(id: string, lineSession: LineSession): Promise<void> {
    const data = diff(lineSession.pgState, LineSessionMapper.toPg(lineSession));
    if (!data) return;

    await this.db
      .updateTable('line_sessions')
      .set(data)
      .where('id', '=', id)
      .execute();
  }

  async findOne(id: string): Promise<LineSession | null> {
    const lineSessionPg = await this.readDb
      .selectFrom('line_sessions')
      .selectAll()
      .where('id', '=', id)
      .limit(1)
      .executeTakeFirst();

    if (!lineSessionPg) {
      return null;
    }

    return LineSessionMapper.fromPgWithState(lineSessionPg);
  }

  async delete(id: string): Promise<void> {
    await this.db.deleteFrom('line_sessions').where('id', '=', id).execute();
  }

  async inactiveAll(lineAccountId: string, lineBotId: string): Promise<void> {
    await this.db
      .updateTable('line_sessions')
      .set({ line_session_status: 'INACTIVE' })
      .where('line_account_id', '=', lineAccountId)
      .where('line_bot_id', '=', lineBotId)
      .execute();
  }
}

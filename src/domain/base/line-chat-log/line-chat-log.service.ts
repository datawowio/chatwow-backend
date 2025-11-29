import { Injectable } from '@nestjs/common';

import { MainDb } from '@infra/db/db.main';

import { diff } from '@shared/common/common.func';

import { LineChatLog } from './line-chat-log.domain';
import {
  lineChatLogFromPgWithState,
  lineChatLogToPg,
} from './line-chat-log.mapper';

@Injectable()
export class LineChatLogService {
  constructor(private db: MainDb) {}

  async findOne(id: string) {
    const lineChatLogPg = await this.db.read
      .selectFrom('line_chat_logs')
      .selectAll()
      .where('id', '=', id)
      .limit(1)
      .executeTakeFirst();

    if (!lineChatLogPg) {
      return null;
    }

    return lineChatLogFromPgWithState(lineChatLogPg);
  }

  async save(lineChatLog: LineChatLog) {
    this._validate(lineChatLog);

    if (!lineChatLog.isPersist) {
      await this._create(lineChatLog);
    } else {
      await this._update(lineChatLog.id, lineChatLog);
    }

    lineChatLog.setPgState(lineChatLogToPg);
  }

  async saveBulk(lineChatLogs: LineChatLog[]) {
    return Promise.all(lineChatLogs.map((u) => this.save(u)));
  }

  async delete(id: string) {
    await this.db.write
      .deleteFrom('line_chat_logs')
      .where('id', '=', id)
      .execute();
  }

  private _validate(_lineChatLog: LineChatLog) {
    // validation rules can be added here
  }

  private async _create(lineChatLog: LineChatLog) {
    await this.db.write
      .insertInto('line_chat_logs')
      .values(lineChatLogToPg(lineChatLog))
      .execute();
  }

  private async _update(id: string, lineChatLog: LineChatLog) {
    const data = diff(lineChatLog.pgState, lineChatLogToPg(lineChatLog));
    if (!data) {
      return;
    }

    await this.db.write
      .updateTable('line_chat_logs')
      .set(data)
      .where('id', '=', id)
      .execute();
  }
}

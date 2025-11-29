import { Injectable } from '@nestjs/common';

import { MainDb } from '@infra/db/db.main';

import { diff } from '@shared/common/common.func';

import { LineBot } from './line-bot.domain';
import { lineBotFromPgWithState, lineBotToPg } from './line-bot.mapper';
import { lineBotsTableFilter } from './line-bot.util';

@Injectable()
export class LineBotService {
  constructor(private db: MainDb) {}

  async findOne(id: string) {
    const lineBotPg = await this.db.read
      .selectFrom('line_bots')
      .selectAll()
      .where('id', '=', id)
      .where(lineBotsTableFilter)
      .limit(1)
      .executeTakeFirst();

    if (!lineBotPg) {
      return null;
    }

    return lineBotFromPgWithState(lineBotPg);
  }

  async save(lineBot: LineBot) {
    this._validate(lineBot);

    if (!lineBot.isPersist) {
      await this._create(lineBot);
    } else {
      await this._update(lineBot.id, lineBot);
    }

    lineBot.setPgState(lineBotToPg);
  }

  async saveBulk(lineBots: LineBot[]) {
    return Promise.all(lineBots.map((bot) => this.save(bot)));
  }

  async delete(id: string) {
    await this.db.write.deleteFrom('line_bots').where('id', '=', id).execute();
  }

  private _validate(_lineBot: LineBot) {
    // validation rules can be added here
  }

  private async _create(lineBot: LineBot) {
    await this.db.write
      .insertInto('line_bots')
      .values(lineBotToPg(lineBot))
      .execute();
  }

  private async _update(id: string, lineBot: LineBot) {
    const data = diff(lineBot.pgState, lineBotToPg(lineBot));
    if (!data) {
      return;
    }

    await this.db.write
      .updateTable('line_bots')
      .set(data)
      .where('id', '=', id)
      .execute();
  }
}

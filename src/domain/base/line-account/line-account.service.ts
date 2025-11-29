import { Injectable } from '@nestjs/common';

import { MainDb } from '@infra/db/db.main';

import { diff } from '@shared/common/common.func';

import { LineAccount } from './line-account.domain';
import {
  lineAccountFromPgWithState,
  lineAccountToPg,
} from './line-account.mapper';
import { lineAccountsTableFilter } from './line-account.util';

@Injectable()
export class LineAccountService {
  constructor(private db: MainDb) {}

  async findOne(id: string) {
    const lineAccountPg = await this.db.read
      .selectFrom('line_accounts')
      .selectAll()
      .where('id', '=', id)
      .where(lineAccountsTableFilter)
      .limit(1)
      .executeTakeFirst();

    if (!lineAccountPg) {
      return null;
    }

    return lineAccountFromPgWithState(lineAccountPg);
  }

  async save(lineAccount: LineAccount) {
    this._validate(lineAccount);
    if (!lineAccount.isPersist) {
      await this._create(lineAccount);
    } else {
      await this._update(lineAccount.id, lineAccount);
    }

    lineAccount.setPgState(lineAccountToPg);
  }

  async saveBulk(lineAccounts: LineAccount[]) {
    return Promise.all(lineAccounts.map((u) => this.save(u)));
  }

  async delete(id: string) {
    await this.db.write
      .deleteFrom('line_accounts')
      .where('id', '=', id)
      .execute();
  }

  private _validate(_lineAccount: LineAccount) {
    // validation rules can be added here
  }

  private async _create(lineAccount: LineAccount) {
    await this.db.write
      .insertInto('line_accounts')
      .values(lineAccountToPg(lineAccount))
      .execute();
  }

  private async _update(id: string, lineAccount: LineAccount) {
    const data = diff(lineAccount.pgState, lineAccountToPg(lineAccount));
    if (!data) {
      return;
    }

    await this.db.write
      .updateTable('line_accounts')
      .set(data)
      .where('id', '=', id)
      .execute();
  }
}

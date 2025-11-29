import { Injectable } from '@nestjs/common';

import { MainDb } from '@infra/db/db.main';

import myDayjs from '@shared/common/common.dayjs';
import { diff } from '@shared/common/common.func';

import { PasswordResetToken } from './password-reset-token.domain';
import {
  passwordResetTokenFromPgWithState,
  passwordResetTokenToPg,
} from './password-reset-token.mapper';

@Injectable()
export class PasswordResetTokenService {
  constructor(private db: MainDb) {}

  async findOne(id: string) {
    const pg = await this.db.read
      .selectFrom('password_reset_tokens')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();

    if (!pg) return null;

    return passwordResetTokenFromPgWithState(pg);
  }

  async save(token: PasswordResetToken) {
    this._validate(token);

    if (!token.isPersist) {
      await this._create(token);
    } else {
      await this._update(token.id, token);
    }

    token.setPgState(passwordResetTokenToPg);
  }

  async saveBulk(tokens: PasswordResetToken[]) {
    return Promise.all(tokens.map((t) => this.save(t)));
  }

  async delete(id: string) {
    await this.db.write
      .deleteFrom('password_reset_tokens')
      .where('id', '=', id)
      .execute();
  }

  async revokeAllOtherToken(passwordResetToken: PasswordResetToken) {
    await this.db.write
      .updateTable('password_reset_tokens')
      .set('revoke_at', myDayjs().toISOString())
      .where('user_id', '=', passwordResetToken.userId)
      .where('id', '!=', passwordResetToken.id)
      .execute();
  }

  private _validate(_token: PasswordResetToken) {
    // validation rules
  }

  private async _create(token: PasswordResetToken) {
    await this.db.write
      .insertInto('password_reset_tokens')
      .values(passwordResetTokenToPg(token))
      .execute();
  }

  private async _update(id: string, token: PasswordResetToken) {
    const data = diff(token.pgState, passwordResetTokenToPg(token));

    if (!data) return;
    await this.db.write
      .updateTable('password_reset_tokens')
      .set(data)
      .where('id', '=', id)
      .execute();
  }
}

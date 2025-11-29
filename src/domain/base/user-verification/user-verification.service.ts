import { Injectable } from '@nestjs/common';

import { MainDb } from '@infra/db/db.main';
import { EmailService } from '@infra/global/email/email.service';
import TemplateSendVerificationCode from '@infra/global/email/template/template.send-verification';

import myDayjs from '@shared/common/common.dayjs';
import { diff, renderHtml } from '@shared/common/common.func';

import type { User } from '../user/user.domain';
import type { UserVerification } from './user-verification.domain';
import {
  userVerificationFromPgWithState,
  userVerificationToPg,
} from './user-verification.mapper';

@Injectable()
export class UserVerificationService {
  constructor(
    private db: MainDb,
    private emailService: EmailService,
  ) {}

  async findOne(id: string) {
    const userVerificationPg = await this.db.read
      .selectFrom('user_verifications')
      .selectAll()
      .where('id', '=', id)
      .limit(1)
      .executeTakeFirst();

    if (!userVerificationPg) {
      return null;
    }

    return userVerificationFromPgWithState(userVerificationPg);
  }

  async save(userVerification: UserVerification) {
    this._validate(userVerification);

    if (!userVerification.isPersist) {
      await this._create(userVerification);
    } else {
      await this._update(userVerification.id, userVerification);
    }

    userVerification.setPgState(userVerificationToPg);
  }

  async saveBulk(userVerifications: UserVerification[]) {
    return Promise.all(userVerifications.map((u) => this.save(u)));
  }

  async delete(id: string) {
    await this.db.write
      .deleteFrom('user_verifications')
      .where('id', '=', id)
      .execute();
  }

  async revokeAll(userId: string) {
    await this.db.write
      .updateTable('user_verifications')
      .set({
        revoke_at: myDayjs().toISOString(),
      })
      .where('user_id', '=', userId)
      .execute();
  }

  async sendVerificationMail(user: User, userVerification: UserVerification) {
    const html = await renderHtml(
      TemplateSendVerificationCode({ userVerification: userVerification }),
    );
    await this.emailService.send(user.email, 'รหัส Otp', html);

    return userVerification;
  }

  private _validate(_userVerification: UserVerification) {
    // validation rules can be added here
  }

  private async _create(userVerification: UserVerification) {
    await this.db.write
      .insertInto('user_verifications')
      .values(userVerificationToPg(userVerification))
      .execute();
  }

  private async _update(id: string, userVerification: UserVerification) {
    const data = diff(
      userVerification.pgState,
      userVerificationToPg(userVerification),
    );
    if (!data) {
      return;
    }

    await this.db.write
      .updateTable('user_verifications')
      .set(data)
      .where('id', '=', id)
      .execute();
  }
}

import { Injectable } from '@nestjs/common';

import { EmailService } from '@infra/global/email/email.service';
import TemplateSendVerificationCode from '@infra/global/email/template/template.send-verification';

import { renderHtml } from '@shared/common/common.func';

import type { User } from '../user/user.domain';
import type { UserVerification } from './user-verification.domain';
import { UserVerificationMapper } from './user-verification.mapper';
import { UserVerificationRepo } from './user-verification.repo';

@Injectable()
export class UserVerificationService {
  constructor(
    private repo: UserVerificationRepo,
    private emailService: EmailService,
  ) {}

  async findOne(id: string) {
    return this.repo.findOne(id);
  }

  async save(userVerification: UserVerification) {
    this._validate(userVerification);

    if (!userVerification.isPersist) {
      await this.repo.create(userVerification);
    } else {
      await this.repo.update(userVerification.id, userVerification);
    }

    userVerification.setPgState(UserVerificationMapper.toPg);
  }

  async saveBulk(userVerifications: UserVerification[]) {
    return Promise.all(userVerifications.map((u) => this.save(u)));
  }

  async delete(id: string) {
    return this.repo.delete(id);
  }

  async revokeAll(userId: string) {
    return this.repo.revokeAll(userId);
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
}

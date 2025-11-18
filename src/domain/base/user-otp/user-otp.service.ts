import { Injectable } from '@nestjs/common';

import { UserOtp } from './user-otp.domain';
import { UserOtpMapper } from './user-otp.mapper';
import { UserOtpRepo } from './user-otp.repo';

@Injectable()
export class UserOtpService {
  constructor(private repo: UserOtpRepo) {}

  async findOne(id: string) {
    return this.repo.findOne(id);
  }

  async save(userOtp: UserOtp) {
    this._validate(userOtp);

    if (!userOtp.isPersist) {
      await this.repo.create(userOtp);
    } else {
      await this.repo.update(userOtp.id, userOtp);
    }

    userOtp.setPgState(UserOtpMapper.toPg);
  }

  async saveBulk(userOtps: UserOtp[]) {
    return Promise.all(userOtps.map((u) => this.save(u)));
  }

  async delete(id: string) {
    return this.repo.delete(id);
  }

  private _validate(_userOtp: UserOtp) {
    // validation rules can be added here
  }
}

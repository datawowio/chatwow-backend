import { DomainEntity } from '@shared/common/common.domain';
import { isDefined } from '@shared/common/common.validator';

import { passwordResetTokenFromPlain } from './password-reset-token.mapper';
import type {
  PasswordResetTokenPg,
  PasswordResetTokenPlain,
  PasswordResetTokenUpdateData,
} from './password-reset-token.type';

export class PasswordResetToken extends DomainEntity<PasswordResetTokenPg> {
  readonly id: string;
  readonly userId: string;
  readonly tokenHash: string;
  readonly createdAt: Date;
  readonly expireAt: Date;
  readonly revokeAt: Date | null;

  constructor(plain: PasswordResetTokenPlain) {
    super();
    Object.assign(this, plain);
  }

  edit(data: PasswordResetTokenUpdateData) {
    const plain: PasswordResetTokenPlain = {
      id: this.id,
      userId: this.userId,
      tokenHash: this.tokenHash,
      createdAt: this.createdAt,
      expireAt: this.expireAt,
      revokeAt: isDefined(data.revokeAt) ? data.revokeAt : this.revokeAt,
    };

    return passwordResetTokenFromPlain(plain);
  }
}

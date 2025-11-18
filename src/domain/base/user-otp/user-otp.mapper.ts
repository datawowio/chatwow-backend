import { toDate } from '@shared/common/common.transformer';

import type {
  UserOtpJson,
  UserOtpPg,
  UserOtpPlain,
} from './types/user-otp.domain.type';
import { UserOtp } from './user-otp.domain';

export class UserOtpMapper {
  static fromPg(pg: UserOtpPg): UserOtp {
    const plain: UserOtpPlain = {
      id: pg.id,
      createdAt: toDate(pg.created_at),
      userId: pg.user_id,
      expireAt: toDate(pg.expire_at),
    };

    return new UserOtp(plain);
  }

  static fromPgWithState(pg: UserOtpPg): UserOtp {
    return this.fromPg(pg).setPgState(this.toPg);
  }

  static fromPlain(plainData: UserOtpPlain): UserOtp {
    const plain: UserOtpPlain = {
      id: plainData.id,
      createdAt: plainData.createdAt,
      userId: plainData.userId,
      expireAt: plainData.expireAt,
    };

    return new UserOtp(plain);
  }

  static fromJson(json: UserOtpJson): UserOtp {
    const plain: UserOtpPlain = {
      id: json.id,
      createdAt: toDate(json.createdAt),
      userId: json.userId,
      expireAt: toDate(json.expireAt),
    };

    return new UserOtp(plain);
  }

  static toPg(userOtp: UserOtp): UserOtpPg {
    return {
      id: userOtp.id,
      created_at: userOtp.createdAt.toISOString(),
      user_id: userOtp.userId,
      expire_at: userOtp.expireAt.toISOString(),
    };
  }

  static toPlain(userOtp: UserOtp): UserOtpPlain {
    return {
      id: userOtp.id,
      createdAt: userOtp.createdAt,
      userId: userOtp.userId,
      expireAt: userOtp.expireAt,
    };
  }

  static toJson(userOtp: UserOtp): UserOtpJson {
    return {
      id: userOtp.id,
      createdAt: userOtp.createdAt,
      userId: userOtp.userId,
      expireAt: userOtp.expireAt,
    };
  }

  static toResponse(userOtp: UserOtp) {
    return {
      id: userOtp.id,
      createdAt: userOtp.createdAt.toISOString(),
      userId: userOtp.userId,
      expireAt: userOtp.expireAt.toISOString(),
    };
  }
}

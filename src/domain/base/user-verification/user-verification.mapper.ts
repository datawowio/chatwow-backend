import { toDate, toISO } from '@shared/common/common.transformer';

import type {
  UserVerificationJson,
  UserVerificationPg,
  UserVerificationPlain,
} from './types/user-verification.domain.type';
import { UserVerification } from './user-verification.domain';
import { UserVerificationResponse } from './user-verification.response';

export class UserVerificationMapper {
  static fromPg(pg: UserVerificationPg): UserVerification {
    const plain: UserVerificationPlain = {
      id: pg.id,
      createdAt: toDate(pg.created_at),
      userId: pg.user_id,
      expireAt: toDate(pg.expire_at),
      revokeAt: toDate(pg.revoke_at),
    };

    return new UserVerification(plain);
  }

  static fromPgWithState(pg: UserVerificationPg): UserVerification {
    return this.fromPg(pg).setPgState(this.toPg);
  }

  static fromPlain(plainData: UserVerificationPlain): UserVerification {
    const plain: UserVerificationPlain = {
      id: plainData.id,
      createdAt: plainData.createdAt,
      userId: plainData.userId,
      expireAt: plainData.expireAt,
      revokeAt: plainData.revokeAt,
    };

    return new UserVerification(plain);
  }

  static fromJson(json: UserVerificationJson): UserVerification {
    const plain: UserVerificationPlain = {
      id: json.id,
      createdAt: toDate(json.createdAt),
      userId: json.userId,
      expireAt: toDate(json.expireAt),
      revokeAt: toDate(json.revokeAt),
    };

    return new UserVerification(plain);
  }

  static toPg(userVerification: UserVerification): UserVerificationPg {
    return {
      id: userVerification.id,
      created_at: userVerification.createdAt.toISOString(),
      user_id: userVerification.userId,
      expire_at: userVerification.expireAt.toISOString(),
      revoke_at: toISO(userVerification.revokeAt),
    };
  }

  static toPlain(userVerification: UserVerification): UserVerificationPlain {
    return {
      id: userVerification.id,
      createdAt: userVerification.createdAt,
      userId: userVerification.userId,
      expireAt: userVerification.expireAt,
      revokeAt: userVerification.revokeAt,
    };
  }

  static toJson(userVerification: UserVerification): UserVerificationJson {
    return {
      id: userVerification.id,
      createdAt: toISO(userVerification.createdAt),
      userId: userVerification.userId,
      expireAt: toISO(userVerification.expireAt),
      revokeAt: toISO(userVerification.revokeAt),
    };
  }

  static toResponse(
    userVerification: UserVerification,
  ): UserVerificationResponse {
    return {
      id: userVerification.id,
      createdAt: toISO(userVerification.createdAt),
      userId: userVerification.userId,
      expireAt: toISO(userVerification.expireAt),
      revokeAt: toISO(userVerification.revokeAt),
    };
  }
}

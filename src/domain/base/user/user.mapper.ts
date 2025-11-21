import {
  toDate,
  toISO,
  toResponseDate,
} from '@shared/common/common.transformer';
import type { WithPgState } from '@shared/common/common.type';

import type { UserJson, UserPg, UserPlain } from './types/user.domain.type';
import { User } from './user.domain';
import type { UserResponse } from './user.response';

export class UserMapper {
  static fromPg(pg: UserPg): User {
    const plain: UserPlain = {
      id: pg.id,
      lastSignedInAt: toDate(pg.last_signed_in_at),
      firstName: pg.first_name,
      lastName: pg.last_name,
      createdAt: toDate(pg.created_at),
      updatedAt: toDate(pg.updated_at),
      createdById: pg.created_by_id,
      updatedById: pg.updated_by_id,
      email: pg.email,
      password: pg.password || null,
      role: pg.role,
      lineAccountId: pg.line_account_id,
      userStatus: pg.user_status,
    };

    return new User(plain);
  }

  static fromPgWithState(pg: UserPg): User {
    return this.fromPg(pg).setPgState(this.toPg);
  }

  static fromPlain(plainData: UserPlain): User {
    const plain: UserPlain = {
      id: plainData.id,
      firstName: plainData.firstName,
      lastName: plainData.lastName,
      createdById: plainData.createdById,
      updatedById: plainData.updatedById,
      lastSignedInAt: plainData.lastSignedInAt,
      createdAt: plainData.createdAt,
      updatedAt: plainData.updatedAt,
      email: plainData.email,
      password: plainData.password,
      role: plainData.role,
      userStatus: plainData.userStatus,
      lineAccountId: plainData.lineAccountId,
    };

    return new User(plain);
  }

  static fromJson(json: UserJson): User {
    const plain: UserPlain = {
      id: json.id,
      firstName: json.firstName,
      lastName: json.lastName,
      createdById: json.createdById,
      updatedById: json.updatedById,
      createdAt: toDate(json.createdAt),
      updatedAt: toDate(json.updatedAt),
      lastSignedInAt: toDate(json.lastSignedInAt),
      email: json.email,
      password: json.password,
      role: json.role,
      userStatus: json.userStatus,
      lineAccountId: json.lineAccountId,
    };

    return new User(plain);
  }
  static fromJsonState(jsonState: WithPgState<UserJson, UserPg>) {
    const domain = UserMapper.fromJson(jsonState.data);
    domain.setPgState(jsonState.state);

    return domain;
  }

  static toPg(domain: User): UserPg {
    return {
      id: domain.id,
      first_name: domain.firstName,
      last_name: domain.lastName,
      created_by_id: domain.createdById,
      updated_by_id: domain.updatedById,
      last_signed_in_at: toISO(domain.lastSignedInAt),
      created_at: toISO(domain.createdAt),
      updated_at: toISO(domain.updatedAt),
      email: domain.email,
      password: domain.password,
      role: domain.role,
      user_status: domain.userStatus,
      line_account_id: domain.lineAccountId,
    };
  }

  static toPlain(domain: User): UserPlain {
    return {
      id: domain.id,
      firstName: domain.firstName,
      lastName: domain.lastName,
      createdAt: domain.createdAt,
      createdById: domain.createdById,
      updatedById: domain.updatedById,
      updatedAt: domain.updatedAt,
      lastSignedInAt: domain.lastSignedInAt,
      email: domain.email,
      password: domain.password,
      role: domain.role,
      userStatus: domain.userStatus,
      lineAccountId: domain.lineAccountId,
    };
  }

  static toJson(domain: User): UserJson {
    return {
      id: domain.id,
      createdAt: toISO(domain.createdAt),
      updatedAt: toISO(domain.updatedAt),
      createdById: domain.createdById,
      updatedById: domain.updatedById,
      firstName: domain.firstName,
      lastName: domain.lastName,
      lastSignedInAt: toISO(domain.lastSignedInAt),
      email: domain.email,
      password: domain.password,
      role: domain.role,
      userStatus: domain.userStatus,
      lineAccountId: domain.lineAccountId,
    };
  }
  static toJsonState(domain: User): WithPgState<UserJson, UserPg> {
    return {
      state: domain.pgState,
      data: UserMapper.toJson(domain),
    };
  }

  static toResponse(domain: User): UserResponse {
    return {
      id: domain.id,
      createdAt: toResponseDate(domain.createdAt),
      updatedAt: toResponseDate(domain.updatedAt),
      lastSignedInAt: toResponseDate(domain.lastSignedInAt),
      firstName: domain.firstName,
      lastName: domain.lastName,
      email: domain.email,
      role: domain.role,
      userStatus: domain.userStatus,
      lineAccountId: domain.lineAccountId,
    };
  }

  static pgToResponse(pg: UserPg): UserResponse {
    return {
      id: pg.id,
      createdAt: toResponseDate(pg.created_at),
      updatedAt: toResponseDate(pg.updated_at),
      lastSignedInAt: toResponseDate(pg.last_signed_in_at),
      firstName: pg.first_name,
      lastName: pg.last_name,
      email: pg.email,
      role: pg.role,
      userStatus: pg.user_status,
      lineAccountId: pg.line_account_id,
    };
  }
}

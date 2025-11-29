import { ReqInfo } from '@infra/global/req-storage/req-storage.common';

import { DomainEntity } from '@shared/common/common.domain';
import { isDefined } from '@shared/common/common.validator';

import { sessionFromPlain } from './session.mapper';
import type {
  SessionPg,
  SessionPlain,
  SessionUpdateData,
} from './session.type';

export class Session extends DomainEntity<SessionPg> {
  readonly id: string;
  readonly userId: string;
  readonly tokenHash: string;
  readonly deviceUid: string;
  readonly createdAt: Date;
  readonly expireAt: Date;
  readonly revokeAt: Date | null;
  readonly info: ReqInfo;

  constructor(plain: SessionPlain) {
    super();
    Object.assign(this, plain);
  }

  edit(data: SessionUpdateData) {
    const plain: SessionPlain = {
      id: this.id,
      userId: this.userId,
      tokenHash: isDefined(data.tokenHash) ? data.tokenHash : this.tokenHash,
      deviceUid: isDefined(data.deviceUid) ? data.deviceUid : this.deviceUid,
      createdAt: this.createdAt,
      expireAt: isDefined(data.expireAt) ? data.expireAt : this.expireAt,
      revokeAt: isDefined(data.revokeAt) ? data.revokeAt : this.revokeAt,
      info: isDefined(data.info) ? data.info : this.info,
    };

    return sessionFromPlain(plain);
  }
}

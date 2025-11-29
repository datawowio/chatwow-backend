import type { ActionType, ActorType } from '@infra/db/db';

import { DomainEntity } from '@shared/common/common.domain';

import type { AuditLogPg, AuditLogPlain } from './audit-log.type';

export class AuditLog extends DomainEntity<AuditLogPg> {
  readonly id: string;
  readonly createdAt: Date;
  readonly actorType: ActorType;
  readonly actionType: ActionType;
  readonly actionDetail: string;
  readonly createdById: string | null;
  readonly ownerTable: string;
  readonly ownerId: string;
  readonly rawData: any;

  constructor(plain: AuditLogPlain) {
    super();
    Object.assign(this, plain);
  }
}

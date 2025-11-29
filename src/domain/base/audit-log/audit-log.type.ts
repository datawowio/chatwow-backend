import type { ActionType, ActorType, AuditLogs } from '@infra/db/db';
import type { DBModel } from '@infra/db/db.common';

import type { Plain, Serialized } from '@shared/common/common.type';

import type { AuditLog } from './audit-log.domain';

export type AuditLogPg = DBModel<AuditLogs>;
export type AuditLogPlain = Plain<AuditLog>;

export type AuditLogJson = Serialized<AuditLogPlain>;

export type AuditLogNewData = {
  ownerId: string;
  ownerTable: string;
  rawData: any;
  createdById: string | null;
  actionDetail?: string;
  actionType: ActionType;
  actorType: ActorType;
};

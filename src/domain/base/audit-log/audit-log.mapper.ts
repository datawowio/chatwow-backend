import { toDate, toISO } from '@shared/common/common.transformer';

import { AuditLog } from './audit-log.domain';
import type { AuditLogResponse } from './audit-log.response';
import type { AuditLogJson, AuditLogPg, AuditLogPlain } from './audit-log.type';

export function auditLogFromPg(pg: AuditLogPg): AuditLog {
  const plain: AuditLogPlain = {
    id: pg.id,
    createdAt: toDate(pg.created_at),
    actorType: pg.actor_type,
    actionType: pg.action_type,
    actionDetail: pg.action_detail,
    createdById: pg.created_by_id,
    ownerTable: pg.owner_table,
    ownerId: pg.owner_id,
    rawData: pg.raw_data,
  };

  return new AuditLog(plain);
}

export function auditLogFromPgWithState(pg: AuditLogPg): AuditLog {
  return auditLogFromPg(pg).setPgState(auditLogToPg);
}

export function auditLogFromPlain(plainData: AuditLogPlain): AuditLog {
  const plain: AuditLogPlain = {
    id: plainData.id,
    createdAt: plainData.createdAt,
    actorType: plainData.actorType,
    actionType: plainData.actionType,
    actionDetail: plainData.actionDetail,
    createdById: plainData.createdById,
    ownerTable: plainData.ownerTable,
    ownerId: plainData.ownerId,
    rawData: plainData.rawData,
  };

  return new AuditLog(plain);
}

export function auditLogFromJson(json: AuditLogJson): AuditLog {
  const plain: AuditLogPlain = {
    id: json.id,
    createdAt: toDate(json.createdAt),
    actorType: json.actorType,
    actionType: json.actionType,
    actionDetail: json.actionDetail,
    createdById: json.createdById,
    ownerTable: json.ownerTable,
    ownerId: json.ownerId,
    rawData: json.rawData,
  };

  return new AuditLog(plain);
}

export function auditLogToPg(domain: AuditLog): AuditLogPg {
  return {
    id: domain.id,
    created_at: toISO(domain.createdAt),
    actor_type: domain.actorType,
    action_type: domain.actionType,
    action_detail: domain.actionDetail,
    created_by_id: domain.createdById,
    owner_table: domain.ownerTable,
    owner_id: domain.ownerId,
    raw_data: domain.rawData,
  };
}

export function auditLogToPlain(domain: AuditLog): AuditLogPlain {
  return {
    id: domain.id,
    createdAt: domain.createdAt,
    actorType: domain.actorType,
    actionType: domain.actionType,
    actionDetail: domain.actionDetail,
    createdById: domain.createdById,
    ownerTable: domain.ownerTable,
    ownerId: domain.ownerId,
    rawData: domain.rawData,
  };
}

export function auditLogToJson(domain: AuditLog): AuditLogJson {
  return {
    id: domain.id,
    createdAt: toISO(domain.createdAt),
    actorType: domain.actorType,
    actionType: domain.actionType,
    actionDetail: domain.actionDetail,
    createdById: domain.createdById,
    ownerTable: domain.ownerTable,
    ownerId: domain.ownerId,
    rawData: domain.rawData,
  };
}

export function auditLogToResponse(domain: AuditLog): AuditLogResponse {
  return {
    id: domain.id,
    createdAt: toISO(domain.createdAt),
    actorType: domain.actorType,
    actionType: domain.actionType,
    actionDetail: domain.actionDetail,
  };
}

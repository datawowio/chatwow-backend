import { uuidV7 } from '@shared/common/common.crypto';
import myDayjs from '@shared/common/common.dayjs';

import { AuditLog } from './audit-log.domain';
import { auditLogFromPlain } from './audit-log.mapper';
import { AuditLogNewData } from './audit-log.type';

export function newAuditLog(data: AuditLogNewData): AuditLog {
  return auditLogFromPlain({
    id: uuidV7(),
    createdAt: myDayjs().toDate(),
    actorType: data.actorType,
    actionType: data.actionType,
    actionDetail: data.actionDetail || '',
    createdById: data.createdById,
    ownerTable: data.ownerTable,
    ownerId: data.ownerId,
    rawData: data.rawData,
  });
}

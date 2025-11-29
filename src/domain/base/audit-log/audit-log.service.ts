import { Injectable } from '@nestjs/common';

import { MainDb } from '@infra/db/db.main';

import { diff } from '@shared/common/common.func';

import { AuditLog } from './audit-log.domain';
import { auditLogFromPgWithState, auditLogToPg } from './audit-log.mapper';

@Injectable()
export class AuditLogService {
  constructor(private readonly db: MainDb) {}

  async findOne(id: string): Promise<AuditLog | null> {
    const userPg = await this.db.read
      .selectFrom('audit_logs')
      .selectAll()
      .where('id', '=', id)
      .limit(1)
      .executeTakeFirst();

    if (!userPg) {
      return null;
    }

    const auditLog = auditLogFromPgWithState(userPg);
    return auditLog;
  }

  async save(auditLog: AuditLog) {
    this._validate(auditLog);

    if (!auditLog.isPersist) {
      await this._create(auditLog);
    } else {
      await this._update(auditLog.id, auditLog);
    }

    auditLog.setPgState(auditLogToPg);
  }

  async saveBulk(lineSessions: AuditLog[]) {
    return Promise.all(lineSessions.map((u) => this.save(u)));
  }

  async delete(id: string) {
    await this.db.write
      //
      .deleteFrom('audit_logs')
      .where('id', '=', id)
      .execute();
  }

  private async _create(auditLog: AuditLog): Promise<void> {
    await this.db.write
      //
      .insertInto('audit_logs')
      .values(auditLogToPg(auditLog))
      .execute();
  }

  private async _update(id: string, auditLog: AuditLog): Promise<void> {
    const data = diff(auditLog.pgState, auditLogToPg(auditLog));
    if (!data) {
      return;
    }

    await this.db.write
      //
      .updateTable('audit_logs')
      .set(data)
      .where('id', '=', id)
      .execute();
  }

  private _validate(_lineSession: AuditLog) {
    // validation rules can be added here
  }
}

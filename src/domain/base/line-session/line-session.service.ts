import { Injectable } from '@nestjs/common';

import { LineSession } from './line-session.domain';
import { LineSessionMapper } from './line-session.mapper';
import { LineSessionRepo } from './line-session.repo';

@Injectable()
export class LineSessionService {
  constructor(private repo: LineSessionRepo) {}

  async findOne(id: string) {
    return this.repo.findOne(id);
  }

  async save(lineSession: LineSession) {
    this._validate(lineSession);

    if (!lineSession.isPersist) {
      await this.repo.create(lineSession);
    } else {
      await this.repo.update(lineSession.id, lineSession);
    }

    lineSession.setPgState(LineSessionMapper.toPg);
  }

  async saveBulk(lineSessions: LineSession[]) {
    return Promise.all(lineSessions.map((u) => this.save(u)));
  }

  async delete(id: string) {
    return this.repo.delete(id);
  }

  private _validate(_lineSession: LineSession) {
    // validation rules can be added here
  }

  async inactiveAll(lineAccountId: string, lineBotId: string): Promise<void> {
    await this.repo.inactiveAll(lineAccountId, lineBotId);
  }
}

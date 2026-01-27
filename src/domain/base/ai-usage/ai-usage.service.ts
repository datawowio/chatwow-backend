import { Injectable } from '@nestjs/common';

import { MainDb } from '@infra/db/db.main';
import { addPagination, queryCount, sortQb } from '@infra/db/db.util';

import { diff, getUniqueIds } from '@shared/common/common.func';
import { isDefined } from '@shared/common/common.validator';
import { ApiException } from '@shared/http/http.exception';

import { AiUsage } from './ai-usage.domain';
import { aiUsageFromPgWithState, aiUsageToPg } from './ai-usage.mapper';
import { AiUsageStopRecordData } from './ai-usage.type';
import { aiUsagesTableFilter } from './ai-usage.util';
import { AiUsageFilterOptions, AiUsageQueryOptions } from './ai-usage.zod';

@Injectable()
export class AiUsageService {
  constructor(private db: MainDb) {}

  async getIds(opts?: AiUsageQueryOptions) {
    const { sort, pagination, filter } = opts?.options || {};

    const qb = await this._getFilterQb({
      filter,
      actor: opts?.actor,
    })
      .select('ai_usages.id')
      .$if(!!sort?.length, (q) =>
        sortQb(q, sort, {
          id: 'ai_usages.id',
          createdAt: 'ai_usages.created_at',
          aiRequestAt: 'ai_usages.ai_request_at',
          aiReplyAt: 'ai_usages.ai_reply_at',
          confidence: 'ai_usages.confidence',
        }),
      )
      .$call((q) => addPagination(q, pagination))
      .execute();

    return getUniqueIds(qb);
  }

  async getCount(opts?: AiUsageFilterOptions) {
    const totalCount = await this
      //
      ._getFilterQb(opts)
      .$call((q) => queryCount(q));

    return totalCount;
  }

  async findOne(id: string): Promise<AiUsage | null> {
    const aiUsagePg = await this.db.read
      .selectFrom('ai_usages')
      .selectAll('ai_usages')
      .where('id', '=', id)
      .limit(1)
      .executeTakeFirst();

    if (!aiUsagePg) {
      return null;
    }

    const aiUsage = aiUsageFromPgWithState(aiUsagePg);
    return aiUsage;
  }

  async save(aiUsage: AiUsage) {
    this._validate(aiUsage);

    if (!aiUsage.isPersist) {
      await this._create(aiUsage);
    } else {
      await this._update(aiUsage.id, aiUsage);
    }

    aiUsage.setPgState(aiUsageToPg);
  }

  async saveBulk(aiUsages: AiUsage[]) {
    return Promise.all(aiUsages.map((p) => this.save(p)));
  }

  async delete(id: string) {
    await this.db.write
      //
      .deleteFrom('ai_usages')
      .where('id', '=', id)
      .execute();
  }

  async deleteBulk(ids: string[]) {
    await Promise.all(ids.map((id) => this.delete(id)));
  }

  async stopRecord(id: string, data: AiUsageStopRecordData) {
    const aiUsage = await this.findOne(id);
    if (!aiUsage) {
      throw new ApiException(404, 'aiUsageNotfound');
    }

    aiUsage.stopRecord(data);
    await this.save(aiUsage);
  }

  private async _create(aiUsage: AiUsage): Promise<void> {
    await this.db.write
      //
      .insertInto('ai_usages')
      .values(aiUsageToPg(aiUsage))
      .execute();
  }

  private async _update(id: string, aiUsage: AiUsage): Promise<void> {
    const data = diff(aiUsage.pgState, aiUsageToPg(aiUsage));
    if (!data) {
      return;
    }

    await this.db.write
      //
      .updateTable('ai_usages')
      .set(data)
      .where('id', '=', id)
      .execute();
  }

  private _getFilterQb(opts?: AiUsageFilterOptions) {
    const { filter } = opts || {};

    return this.db.read
      .selectFrom('ai_usages')
      .where(aiUsagesTableFilter)
      .$if(!!filter?.createdByIds?.length, (qb) =>
        qb.where('ai_usages.created_by_id', 'in', filter!.createdByIds!),
      )
      .$if(!!filter?.projectIds?.length, (qb) =>
        qb.where('ai_usages.project_id', 'in', filter!.projectIds!),
      )
      .$if(isDefined(filter?.refTable), (qb) =>
        qb.where('ref_table', '=', filter!.refTable!),
      )
      .$if(isDefined(filter?.refId), (qb) =>
        qb.where('ref_id', '=', filter!.refId!),
      );
  }

  private _validate(_aiUsage: AiUsage) {
    // validation rules can be added here
  }
}

import { Injectable } from '@nestjs/common';
import { Except } from 'type-fest';

import { getErrorKey } from '@infra/db/db.common';
import { MainDb } from '@infra/db/db.main';
import { addPagination, queryCount, sortQb } from '@infra/db/db.util';

import { diff, getUniqueIds } from '@shared/common/common.func';
import { isDefined } from '@shared/common/common.validator';
import { ApiException } from '@shared/http/http.exception';

import { AiUsageToken } from './ai-usage-token.domain';
import {
  aiUsageTokenFromPgWithState,
  aiUsageTokenToPg,
} from './ai-usage-token.mapper';
import { aiUsageTokensTableFilter } from './ai-usage-token.util';
import {
  AiUsageTokenCountQueryOptions,
  AiUsageTokenQueryOptions,
} from './ai-usage-token.zod';

@Injectable()
export class AiUsageTokenService {
  constructor(private db: MainDb) {}

  async getIds(opts?: AiUsageTokenQueryOptions) {
    opts ??= {};
    const { sort, pagination } = opts;

    const qb = await this._getFilterQb(opts)
      .select('ai_usage_tokens.id')
      .$if(!!sort?.length, (q) =>
        sortQb(q, opts!.sort, {
          id: 'ai_usage_tokens.id',
          createdAt: 'ai_usage_tokens.created_at',
          inputTokens: 'ai_usage_tokens.input_tokens',
          outputTokens: 'ai_usage_tokens.output_tokens',
          totalTokens: 'ai_usage_tokens.total_tokens',
          totalPrice: 'ai_usage_tokens.total_price',
          initialTotalPrice: 'ai_usage_tokens.initial_total_price',
        }),
      )
      .$call((q) => addPagination(q, pagination))
      .execute();

    return getUniqueIds(qb);
  }

  async getCount(opts?: AiUsageTokenCountQueryOptions) {
    const totalCount = await this
      //
      ._getFilterQb({
        filter: opts?.filter,
      })
      .$call((q) => queryCount(q));

    return totalCount;
  }

  async findOne(id: string) {
    const aiUsageTokenPg = await this.db.read
      .selectFrom('ai_usage_tokens')
      .selectAll()
      .where('id', '=', id)
      .where(aiUsageTokensTableFilter)
      .limit(1)
      .executeTakeFirst();

    if (!aiUsageTokenPg) {
      return null;
    }

    const aiUsageToken = aiUsageTokenFromPgWithState(aiUsageTokenPg);
    return aiUsageToken;
  }

  async findMany(ids: string[]) {
    const aiUsageTokenPgs = await this.db.read
      .selectFrom('ai_usage_tokens')
      .selectAll()
      .where('id', 'in', ids)
      .where(aiUsageTokensTableFilter)
      .execute();

    return aiUsageTokenPgs.map((u) => aiUsageTokenFromPgWithState(u));
  }

  async findByAiUsageIds(aiUsageIds: string[]) {
    const aiUsageTokenPgs = await this.db.read
      .selectFrom('ai_usage_tokens')
      .selectAll()
      .where('ai_usage_id', 'in', aiUsageIds)
      .where(aiUsageTokensTableFilter)
      .execute();

    return aiUsageTokenPgs.map((u) => aiUsageTokenFromPgWithState(u));
  }

  async save(aiUsageToken: AiUsageToken) {
    this._validate(aiUsageToken);

    if (!aiUsageToken.isPersist) {
      await this._create(aiUsageToken);
    } else {
      await this._update(aiUsageToken.id, aiUsageToken);
    }

    aiUsageToken.setPgState(aiUsageTokenToPg);
  }

  async saveBulk(aiUsageTokens: AiUsageToken[]) {
    return Promise.all(aiUsageTokens.map((u) => this.save(u)));
  }

  async delete(id: string) {
    await this.db.write
      //
      .deleteFrom('ai_usage_tokens')
      .where('id', '=', id)
      .execute();
  }

  private _validate(_aiUsageToken: AiUsageToken) {
    // validation rules can be added here
  }

  private async _create(aiUsageToken: AiUsageToken) {
    await this._tryWrite(async () =>
      this.db.write
        //
        .insertInto('ai_usage_tokens')
        .values(aiUsageTokenToPg(aiUsageToken))
        .execute(),
    );
  }

  private async _update(id: string, aiUsageToken: AiUsageToken) {
    const data = diff(aiUsageToken.pgState, aiUsageTokenToPg(aiUsageToken));
    if (!data) {
      return;
    }

    await this._tryWrite(async () =>
      this.db.write
        //
        .updateTable('ai_usage_tokens')
        .set(data)
        .where('id', '=', id)
        .execute(),
    );
  }

  private async _tryWrite<T>(cb: () => Promise<T>) {
    try {
      const data = await cb();
      return data;
    } catch (e: any) {
      const errKey = getErrorKey(e);
      if (errKey === 'exists') {
        throw new ApiException(409, 'aiUsageTokenExists');
      }

      throw new ApiException(500, 'internal');
    }
  }

  private _getFilterQb(opts?: Except<AiUsageTokenQueryOptions, 'pagination'>) {
    const filter = opts?.filter;

    return this.db.read
      .selectFrom('ai_usage_tokens')
      .select('ai_usage_tokens.id')
      .where(aiUsageTokensTableFilter)
      .$if(isDefined(filter?.aiUsageId), (q) =>
        q.where('ai_usage_tokens.ai_usage_id', '=', filter!.aiUsageId!),
      )
      .$if(!!filter?.aiUsageIds?.length, (q) =>
        q.where('ai_usage_tokens.ai_usage_id', 'in', filter!.aiUsageIds!),
      )
      .$if(isDefined(filter?.aiModelName), (q) =>
        q.where('ai_usage_tokens.ai_model_name', '=', filter!.aiModelName!),
      )
      .$if(isDefined(filter?.minInputTokens), (q) =>
        q.where('ai_usage_tokens.input_tokens', '>=', filter!.minInputTokens!),
      )
      .$if(isDefined(filter?.maxInputTokens), (q) =>
        q.where('ai_usage_tokens.input_tokens', '<=', filter!.maxInputTokens!),
      )
      .$if(isDefined(filter?.minOutputTokens), (q) =>
        q.where(
          'ai_usage_tokens.output_tokens',
          '>=',
          filter!.minOutputTokens!,
        ),
      )
      .$if(isDefined(filter?.maxOutputTokens), (q) =>
        q.where(
          'ai_usage_tokens.output_tokens',
          '<=',
          filter!.maxOutputTokens!,
        ),
      )
      .$if(isDefined(filter?.minTotalTokens), (q) =>
        q.where('ai_usage_tokens.total_tokens', '>=', filter!.minTotalTokens!),
      )
      .$if(isDefined(filter?.maxTotalTokens), (q) =>
        q.where('ai_usage_tokens.total_tokens', '<=', filter!.maxTotalTokens!),
      )
      .$if(isDefined(filter?.minTotalPrice), (q) =>
        q.where(
          'ai_usage_tokens.total_price',
          '>=',
          filter!.minTotalPrice!.toString(),
        ),
      )
      .$if(isDefined(filter?.maxTotalPrice), (q) =>
        q.where(
          'ai_usage_tokens.total_price',
          '<=',
          filter!.maxTotalPrice!.toString(),
        ),
      );
  }
}

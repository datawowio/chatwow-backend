import { aiUsagesTableFilter } from '@domain/base/ai-usage/ai-usage.util';
import { departmentPgToResponse } from '@domain/base/department/department.mapper';
import { projectPgToResponse } from '@domain/base/project/project.mapper';
import { userPgToResponse } from '@domain/base/user/user.mapper';
import { UserPg } from '@domain/base/user/user.type';
import { Injectable } from '@nestjs/common';
import { sql } from 'kysely';
import { jsonObjectFrom } from 'kysely/helpers/postgres';
import { match } from 'ts-pattern';

import { Ref } from '@infra/db/db.common';
import { MainDb } from '@infra/db/db.main';
import { addPagination, queryCount, sortQb } from '@infra/db/db.util';

import { newBig } from '@shared/common/common.func';
import { getPagination } from '@shared/common/common.pagination';
import { toCurrencyDisplay } from '@shared/common/common.transformer';
import { QueryInterface } from '@shared/common/common.type';
import { toHttpSuccess } from '@shared/http/http.mapper';

import {
  AiUsageSummaryAnalytic,
  AiUsageSummaryDto,
  AiUsageSummaryResponse,
} from './ai-usage-summary.dto';

@Injectable()
export class AiUsageSummaryQuery implements QueryInterface {
  constructor(private db: MainDb) {}

  async exec(query: AiUsageSummaryDto): Promise<AiUsageSummaryResponse> {
    const { result, totalCount } = await this.getRaw(query);

    const metaCalc = {
      totalPrice: newBig(0),
      totalTokenUsed: 0,
      totalChatUsages: 0,
      totalAnswerable: 0,
      avgReplyTimeMs: 0,
      avgConfidence: 0,

      maxPrice: newBig(0),
      maxTokenUsed: 0,
      maxChatUsages: 0,
      maxAnswerable: 0,
      maxAvgReplyTimeMs: 0,
      maxAvgConfidence: 0,

      minPrice: newBig(0),
      minTokenUsed: 0,
      minChatUsages: 0,
      minAnswerable: 0,
      minAvgReplyTimeMs: 0,
      minAvgConfidence: 0,
    };

    const aiUsageSummaries: AiUsageSummaryAnalytic[] = result.map((rawData) => {
      const price = newBig(rawData.totalPrice || 0);
      const tokens = Number(rawData.totalTokenUsed || 0);
      const usages = Number(rawData.totalChatUsages || 0);
      const replyTime = Number(rawData.avgReplyTimeMs || 0);
      const confidence = Number(rawData.avgConfidence || 0);
      const answerable = Number(rawData.totalAnswerable || 0);

      // Aggregate
      metaCalc.totalPrice = metaCalc.totalPrice.add(price);
      metaCalc.totalTokenUsed += tokens;
      metaCalc.totalChatUsages += usages;
      metaCalc.avgReplyTimeMs += replyTime;
      metaCalc.avgConfidence += confidence;
      metaCalc.totalAnswerable += answerable;

      metaCalc.maxPrice = price.gt(metaCalc.maxPrice)
        ? price
        : metaCalc.maxPrice;
      metaCalc.maxTokenUsed =
        tokens > metaCalc.maxTokenUsed ? tokens : metaCalc.maxTokenUsed;
      metaCalc.maxChatUsages =
        usages > metaCalc.maxChatUsages ? usages : metaCalc.maxChatUsages;
      metaCalc.maxAnswerable =
        answerable > metaCalc.maxAnswerable
          ? answerable
          : metaCalc.maxAnswerable;
      metaCalc.maxAvgReplyTimeMs =
        replyTime > metaCalc.maxAvgReplyTimeMs
          ? replyTime
          : metaCalc.maxAvgReplyTimeMs;
      metaCalc.maxAvgConfidence =
        confidence > metaCalc.maxAvgConfidence
          ? confidence
          : metaCalc.maxAvgConfidence;

      metaCalc.minPrice = metaCalc.minPrice.eq(0)
        ? price
        : price.lt(metaCalc.minPrice)
          ? price
          : metaCalc.minPrice;
      metaCalc.minTokenUsed =
        metaCalc.minTokenUsed === 0
          ? tokens
          : tokens < metaCalc.minTokenUsed
            ? tokens
            : metaCalc.minTokenUsed;
      metaCalc.minChatUsages =
        metaCalc.minChatUsages === 0
          ? usages
          : usages < metaCalc.minChatUsages
            ? usages
            : metaCalc.minChatUsages;
      metaCalc.minAnswerable =
        metaCalc.minAnswerable === 0
          ? answerable
          : answerable < metaCalc.minAnswerable
            ? answerable
            : metaCalc.minAnswerable;
      metaCalc.minAvgReplyTimeMs =
        metaCalc.minAvgReplyTimeMs === 0
          ? replyTime
          : replyTime < metaCalc.minAvgReplyTimeMs
            ? replyTime
            : metaCalc.minAvgReplyTimeMs;
      metaCalc.minAvgConfidence =
        metaCalc.minAvgConfidence === 0
          ? confidence
          : confidence < metaCalc.minAvgConfidence
            ? confidence
            : metaCalc.minAvgConfidence;

      return {
        timestamp: rawData.timestamp,
        summary: {
          totalPrice: toCurrencyDisplay(price),
          totalTokenUsed: +tokens.toFixed(2),
          totalChatUsages: +usages.toFixed(2),
          avgReplyTimeMs: +replyTime.toFixed(2),
          avgConfidence: +confidence.toFixed(2),
          totalAnswerable: +answerable.toFixed(2),
        },
        relations: {
          project: rawData?.project
            ? { attributes: projectPgToResponse(rawData.project) }
            : undefined,
          department: rawData?.department
            ? { attributes: departmentPgToResponse(rawData.department) }
            : undefined,
          user: rawData?.user
            ? { attributes: userPgToResponse(rawData.user as UserPg) }
            : undefined,
        },
      };
    });

    // cal average
    if (aiUsageSummaries.length > 0) {
      metaCalc.avgReplyTimeMs =
        metaCalc.avgReplyTimeMs / aiUsageSummaries.length;
      metaCalc.avgConfidence = metaCalc.avgConfidence / aiUsageSummaries.length;
    }

    return toHttpSuccess({
      meta: {
        pageSummary: {
          totalPrice: toCurrencyDisplay(metaCalc.totalPrice),
          totalTokenUsed: +metaCalc.totalTokenUsed.toFixed(2),
          totalAnswerable: +metaCalc.totalAnswerable.toFixed(2),
          totalChatUsages: +metaCalc.totalChatUsages.toFixed(2),
          avgReplyTimeMs: +metaCalc.avgReplyTimeMs.toFixed(2),
          avgConfidence: +metaCalc.avgConfidence.toFixed(2),

          maxPrice: toCurrencyDisplay(metaCalc.maxPrice),
          maxTokenUsed: +metaCalc.maxTokenUsed.toFixed(2),
          maxAnswerable: +metaCalc.maxAnswerable.toFixed(2),
          maxChatUsages: +metaCalc.maxChatUsages.toFixed(2),
          maxAvgReplyTimeMs: +metaCalc.maxAvgReplyTimeMs.toFixed(2),
          maxAvgConfidence: +metaCalc.maxAvgConfidence.toFixed(2),

          minPrice: toCurrencyDisplay(metaCalc.minPrice),
          minTokenUsed: +metaCalc.minTokenUsed.toFixed(2),
          minAnswerable: +metaCalc.minAnswerable.toFixed(2),
          minChatUsages: +metaCalc.minChatUsages.toFixed(2),
          minAvgReplyTimeMs: +metaCalc.minAvgReplyTimeMs.toFixed(2),
          minAvgConfidence: +metaCalc.minAvgConfidence.toFixed(2),
        },
        pagination: totalCount
          ? getPagination(result, totalCount, query.group!.pagination)
          : undefined,
      },
      data: {
        chatSummaries: aiUsageSummaries,
      },
    });
  }

  async getRaw(query: AiUsageSummaryDto) {
    const filter = query.filter;
    const mainColumn = this.getMainColumn(query);

    const baseQuery = this.db.read
      .selectFrom('ai_usages')
      .leftJoin('users', 'users.id', 'ai_usages.created_by_id')
      .where(aiUsagesTableFilter)
      .$if(!!filter?.aiUsageActions?.length, (q) =>
        q.where('ai_usages.ai_usage_action', 'in', filter!.aiUsageActions!),
      )
      .$if(!!filter?.startAt, (q) =>
        q.where('ai_usages.ai_request_at', '>=', filter!.startAt!),
      )
      .$if(!!filter?.endAt, (q) =>
        q.where('ai_usages.ai_request_at', '<=', filter!.endAt!),
      )
      .$if(!!filter?.projectIds?.length, (q) =>
        q.where('ai_usages.project_id', 'in', filter!.projectIds!),
      )
      .$if(!!filter?.departmentIds?.length, (q) =>
        q.where('users.department_id', 'in', filter!.departmentIds!),
      )
      .$if(!!filter?.userIds?.length, (q) =>
        q.where('ai_usages.created_by_id', 'in', filter!.userIds!),
      );

    const filterQb = baseQuery
      .$call((q) => addPagination(q, query.group?.pagination))
      .select(mainColumn)
      .groupBy(mainColumn)
      .orderBy(({ fn }) => fn.min('ai_usages.ai_reply_at'), 'asc');

    const qb = baseQuery
      .select(({ fn }) => [
        fn.sum<string>('ai_usages.token_used').as('totalTokenUsed'),
        fn.sum<string>('ai_usages.token_price').as('totalPrice'),
        fn.avg<string>('ai_usages.reply_time_ms').as('avgReplyTimeMs'),
        fn.count<string>('ai_usages.id').as('totalChatUsages'),
        fn
          .count<string>('ai_usages.id')
          .filterWhere('ai_usages.confidence', '>=', 50)
          .as('totalAnswerable'),
        fn.avg<string>('ai_usages.confidence').as('avgConfidence'),
      ])
      .$if(!!query.period, (q) =>
        q
          .select(({ fn, ref }) =>
            fn<string>('date_trunc', [
              sql.lit(query.period),
              ref('ai_usages.ai_request_at'),
            ]).as('timestamp'),
          )
          .groupBy('timestamp')
          .orderBy('timestamp', 'asc'),
      )
      .$if(!!query.group?.sort?.length, (q) =>
        sortQb(q, query.group!.sort!, {
          totalTokenUsed: 'totalTokenUsed',
          totalPrice: 'totalPrice',
          avgReplyTimeMs: 'avgReplyTimeMs',
          totalChatUsages: 'totalChatUsages',
          totalAnswerable: 'totalAnswerable',
          avgConfidence: 'avgConfidence',
        }),
      )
      .$if(query.group?.by === 'department', (q) =>
        q
          .select((eb) =>
            jsonObjectFrom(
              eb
                .selectFrom('departments')
                .selectAll('departments')
                .whereRef('departments.id', '=', 'users.department_id'),
            ).as('department'),
          )
          .groupBy('users.department_id')
          .orderBy('users.department_id', 'asc'),
      )
      .$if(query.group?.by === 'project', (q) =>
        q
          .select((eb) =>
            jsonObjectFrom(
              eb
                .selectFrom('projects')
                .selectAll('projects')
                .whereRef('projects.id', '=', 'ai_usages.project_id'),
            ).as('project'),
          )
          .groupBy('ai_usages.project_id')
          .orderBy('ai_usages.project_id', 'asc'),
      )
      .$if(query.group?.by === 'user', (q) =>
        q
          .select((eb) =>
            jsonObjectFrom(
              eb
                .selectFrom('users')
                .selectAll('users')
                .whereRef('users.id', '=', 'ai_usages.created_by_id'),
            ).as('user'),
          )
          .groupBy('ai_usages.created_by_id')
          .orderBy('ai_usages.created_by_id', 'asc'),
      )
      // any here because complex
      .where(mainColumn as any, 'in', filterQb);

    let totalCount: number | null = null;
    if (query.group?.pagination) {
      totalCount = await filterQb.$call((q) => queryCount(q));
    }

    const result = await qb.execute();

    return { result, totalCount };
  }

  getMainColumn(query: AiUsageSummaryDto) {
    return match(query.group?.by)
      .returnType<Ref<'ai_usages' | 'users'>>()
      .with('project', () => 'ai_usages.project_id')
      .with('user', () => 'ai_usages.created_by_id')
      .with('department', () => 'users.department_id')
      .with(undefined, () => 'ai_usages.id')
      .exhaustive();
  }
}

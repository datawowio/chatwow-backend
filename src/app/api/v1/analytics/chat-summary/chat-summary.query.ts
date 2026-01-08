import { AI_USAGE_CHAT_ACTION } from '@domain/base/ai-usage/ai-usage.constant';
import { aiUsagesTableFilter } from '@domain/base/ai-usage/ai-usage.util';
import { projectPgToResponse } from '@domain/base/project/project.mapper';
import { userGroupPgToResponse } from '@domain/base/user-group/user-group.mapper';
import { userPgToResponse } from '@domain/base/user/user.mapper';
import { Injectable } from '@nestjs/common';
import { sql } from 'kysely';
import { jsonObjectFrom } from 'kysely/helpers/postgres';

import { MainDb } from '@infra/db/db.main';

import { newBig } from '@shared/common/common.func';
import { fromDbCurrency } from '@shared/common/common.transformer';
import { QueryInterface } from '@shared/common/common.type';
import { toHttpSuccess } from '@shared/http/http.mapper';

import {
  ChatSummaryAnalytic,
  ChatSummaryDto,
  ChatSummaryResponse,
} from './chat-summary.dto';

@Injectable()
export class ChatSummaryQuery implements QueryInterface {
  constructor(private db: MainDb) {}

  async exec(query: ChatSummaryDto): Promise<ChatSummaryResponse> {
    const raw = await this.getRaw(query);

    const metaCalc = {
      totalPrice: newBig(0),
      totalTokenUsed: 0,
      totalChatUsages: 0,
      avgReplyTimeMs: 0,
      avgConfidence: 0,
    };

    const chatSummaries: ChatSummaryAnalytic[] = raw.map((rawData) => {
      const price = fromDbCurrency(rawData.totalPrice || '0');
      const tokens = Number(rawData.totalTokenUsed || 0);
      const usages = Number(rawData.totalChatUsages || 0);
      const replyTime = Number(rawData.avgReplyTimeMs || 0);
      const confidence = Number(rawData.avgConfidence || 0);

      // Aggregate
      metaCalc.totalPrice = metaCalc.totalPrice.add(price);
      metaCalc.totalTokenUsed += tokens;
      metaCalc.totalChatUsages += usages;
      metaCalc.avgReplyTimeMs += replyTime;
      metaCalc.avgConfidence += confidence;

      return {
        timestamp: rawData.timestamp,
        summary: {
          totalPrice: price.toFixed(2),
          totalTokenUsed: tokens,
          totalChatUsages: usages,
          avgReplyTimeMs: replyTime,
          avgConfidence: confidence,
        },
        relations: {
          project: rawData?.project
            ? { attributes: projectPgToResponse(rawData.project) }
            : undefined,
          userGroup: rawData?.userGroup
            ? { attributes: userGroupPgToResponse(rawData.userGroup) }
            : undefined,
          user: rawData?.user
            ? { attributes: userPgToResponse(rawData.user) }
            : undefined,
        },
      };
    });

    // cal average
    if (chatSummaries.length > 0) {
      metaCalc.avgReplyTimeMs = metaCalc.avgReplyTimeMs / chatSummaries.length;
      metaCalc.avgConfidence = metaCalc.avgConfidence / chatSummaries.length;
    }

    return toHttpSuccess({
      meta: {
        totalPrice: metaCalc.totalPrice.toFixed(2),
        totalTokenUsed: metaCalc.totalTokenUsed,
        totalChatUsages: metaCalc.totalChatUsages,
        avgReplyTimeMs: metaCalc.avgReplyTimeMs,
        avgConfidence: metaCalc.avgConfidence,
      },
      data: {
        chatSummaries,
      },
    });
  }

  async getRaw(query: ChatSummaryDto) {
    const filter = query.filter;

    let initSelectQb = this.db.read
      .selectFrom('ai_usages')
      .select(({ fn }) => [
        fn.count<string>('ai_usages.token_used').as('totalTokenUsed'),
        fn.sum<string>('ai_usages.token_price').as('totalPrice'),
        fn.avg<string>('ai_usages.reply_time_ms').as('avgReplyTimeMs'),
        fn.count<string>('ai_usages.id').as('totalChatUsages'),
        fn.avg<string>('ai_usages.confidence').as('avgConfidence'),
      ]);

    if (query.groupBy === 'userGroup') {
      // if user group we need to reset select but still same schema
      initSelectQb = initSelectQb
        .clearSelect()
        .innerJoin(
          'ai_usage_user_groups',
          'ai_usage_user_groups.ai_usage_id',
          'ai_usages.id',
        )
        .select(({ fn }) => [
          fn.count('ai_usage_user_groups.token_used').as('totalTokenUsed'),
          fn.sum('ai_usage_user_groups.token_price').as('totalPrice'),
          fn.avg('ai_usages.reply_time_ms').as('avgReplyTimeMs'),
          fn.sum('ai_usage_user_groups.chat_count').as('totalChatUsages'),
          fn.avg('ai_usages.confidence').as('avgConfidence'),
        ]) as typeof qb;
    }

    const qb = initSelectQb
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
      .$if(query.groupBy === 'userGroup', (q) =>
        q
          .innerJoin(
            'ai_usage_user_groups',
            'ai_usage_user_groups.ai_usage_id',
            'ai_usages.id',
          )
          .select((eb) =>
            jsonObjectFrom(
              eb
                .selectFrom('user_groups')
                .selectAll('user_groups')
                .whereRef(
                  'user_groups.id',
                  '=',
                  'ai_usage_user_groups.user_group_id',
                ),
            ).as('userGroup'),
          )
          .groupBy('ai_usage_user_groups.user_group_id')
          .orderBy('ai_usage_user_groups.user_group_id', 'asc'),
      )
      .$if(query.groupBy === 'project', (q) =>
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
      .$if(query.groupBy === 'user', (q) =>
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
      .$if(!!filter?.startAt, (q) =>
        q.where('ai_usages.ai_request_at', '>=', filter!.startAt!),
      )
      .$if(!!filter?.endAt, (q) =>
        q.where('ai_usages.ai_request_at', '<=', filter!.endAt!),
      )
      .where('ai_usages.ai_usage_action', 'in', AI_USAGE_CHAT_ACTION)
      .where(aiUsagesTableFilter);

    return qb.execute();
  }
}

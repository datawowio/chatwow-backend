import { projectChatQuestionRecommendationPgToResponse } from '@domain/base/project-chat-question-recommendation/project-chat-question-recommendation.mapper';
import { ProjectChatQuestionRecommendationService } from '@domain/base/project-chat-question-recommendation/project-chat-question-recommendation.service';
import { Injectable } from '@nestjs/common';

import { MainDb } from '@infra/db/db.main';
import { filterQbIds } from '@infra/db/db.util';

import { getPagination } from '@shared/common/common.pagination';
import { QueryInterface } from '@shared/common/common.type';
import { toHttpSuccess } from '@shared/http/http.mapper';

import {
  ListProjectChatQuestionRecommendationsDto,
  ListProjectChatQuestionRecommendationsResponse,
} from './list-project-chat-question-recommendations.dto';

@Injectable()
export class ListProjectChatQuestionRecommendationsQuery
  implements QueryInterface
{
  constructor(
    private db: MainDb,
    private projectChatQuestionRecommendationService: ProjectChatQuestionRecommendationService,
  ) {}

  async exec(
    query: ListProjectChatQuestionRecommendationsDto,
  ): Promise<ListProjectChatQuestionRecommendationsResponse> {
    // default filter - no user-specific filtering needed for question recommendations
    query.filter ??= {};
    query.countFilter ??= {};

    const { result, totalCount } = await this.getRaw(query);

    return toHttpSuccess({
      meta: {
        pagination: getPagination(result, totalCount, query.pagination),
      },
      data: {
        projectChatQuestionRecommendations: result.map(
          (projectChatQuestionRecommendation) => ({
            attributes: projectChatQuestionRecommendationPgToResponse(
              projectChatQuestionRecommendation,
            ),
            relations: {},
          }),
        ),
      },
    });
  }

  async getRaw(query: ListProjectChatQuestionRecommendationsDto) {
    const ids = await this.projectChatQuestionRecommendationService.getIds({
      filter: query.filter,
      sort: query.sort,
      pagination: query.pagination,
    });
    if (!ids) {
      return {
        result: [],
        totalCount: 0,
      };
    }

    const result = await this.db.read
      .selectFrom('project_chat_question_recommendations')
      .selectAll()
      .$call((q) =>
        filterQbIds(ids, q, 'project_chat_question_recommendations.id'),
      )
      .execute();

    const totalCount =
      await this.projectChatQuestionRecommendationService.getCount({
        filter: query.countFilter,
      });

    return {
      result,
      totalCount,
    };
  }
}

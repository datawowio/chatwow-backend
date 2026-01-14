import { ProjectChatQuestionRecommendationResponse } from '@domain/base/project-chat-question-recommendation/project-chat-question-recommendation.response';
import {
  projectChatQuestionRecommendationFilterZod,
  projectChatQuestionRecommendationSortZod,
} from '@domain/base/project-chat-question-recommendation/project-chat-question-recommendation.zod';
import { ApiProperty } from '@nestjs/swagger';
import z from 'zod';

import type { IDomainData } from '@shared/common/common.type';
import {
  PaginationMetaResponse,
  StandardResponse,
} from '@shared/http/http.response.dto';
import { paginationZod, zodDto } from '@shared/zod/zod.util';

// ================ Request ================

const zod = z.object({
  sort: projectChatQuestionRecommendationSortZod,
  filter: projectChatQuestionRecommendationFilterZod.optional(),
  countFilter: projectChatQuestionRecommendationFilterZod.optional(),
  pagination: paginationZod,
});

export class ListProjectChatQuestionRecommendationsDto extends zodDto(zod) {}

// ================ Response ================

export class ListProjectChatQuestionRecommendationsProjectsData
  implements IDomainData
{
  @ApiProperty({ type: () => ProjectChatQuestionRecommendationResponse })
  attributes: ProjectChatQuestionRecommendationResponse;

  @ApiProperty()
  relations: object;
}

export class ListProjectChatQuestionRecommendationsData {
  @ApiProperty({
    type: () => ListProjectChatQuestionRecommendationsProjectsData,
    isArray: true,
  })
  projectChatQuestionRecommendations: ListProjectChatQuestionRecommendationsProjectsData[];
}

export class ListProjectChatQuestionRecommendationsResponse extends StandardResponse {
  @ApiProperty({ type: () => ListProjectChatQuestionRecommendationsData })
  data: ListProjectChatQuestionRecommendationsData;

  @ApiProperty({ type: () => PaginationMetaResponse })
  meta: PaginationMetaResponse;
}

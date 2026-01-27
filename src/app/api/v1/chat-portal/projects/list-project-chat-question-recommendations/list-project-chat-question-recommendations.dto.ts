import { ProjectChatQuestionRecommendationResponse } from '@domain/base/project-chat-question-recommendation/project-chat-question-recommendation.response';
import {
  projectChatQuestionRecommendationFilterZod,
  projectChatQuestionRecommendationSortZod,
} from '@domain/base/project-chat-question-recommendation/project-chat-question-recommendation.zod';
import { ProjectResponse } from '@domain/base/project/project.response';
import { ApiProperty } from '@nestjs/swagger';
import z from 'zod';

import type { IDomainData } from '@shared/common/common.type';
import {
  PaginationMetaResponse,
  StandardResponse,
} from '@shared/http/http.response.dto';
import { paginationZod, zodDto } from '@shared/zod/zod.util';

import { listProjectChatQuestionRecommendationIncludesZod } from './list-project-chat-question-recommendations.util';

// ================ Request ================

const zod = z.object({
  includes: listProjectChatQuestionRecommendationIncludesZod,
  sort: projectChatQuestionRecommendationSortZod,
  filter: projectChatQuestionRecommendationFilterZod.optional(),
  countFilter: projectChatQuestionRecommendationFilterZod.optional(),
  pagination: paginationZod,
});

export class ListProjectChatQuestionRecommendationsDto extends zodDto(zod) {}

// ================ Response ================

class ListProjectChatQuestionRecommendationsProjectsData
  implements IDomainData
{
  @ApiProperty({ type: () => ProjectResponse })
  attributes: ProjectResponse;
}

class ListProjectChatQuestionRecommendationsRelations {
  @ApiProperty({
    type: () => ListProjectChatQuestionRecommendationsProjectsData,
    nullable: true,
  })
  project?: ListProjectChatQuestionRecommendationsProjectsData;
}

export class ListProjectChatQuestionRecommendationsQuestionRecommendationsData
  implements IDomainData
{
  @ApiProperty({ type: () => ProjectChatQuestionRecommendationResponse })
  attributes: ProjectChatQuestionRecommendationResponse;

  @ApiProperty({ type: () => ListProjectChatQuestionRecommendationsRelations })
  relations: ListProjectChatQuestionRecommendationsRelations;
}

export class ListProjectChatQuestionRecommendationsData {
  @ApiProperty({
    type: () =>
      ListProjectChatQuestionRecommendationsQuestionRecommendationsData,
    isArray: true,
  })
  projectChatQuestionRecommendations: ListProjectChatQuestionRecommendationsQuestionRecommendationsData[];
}

export class ListProjectChatQuestionRecommendationsResponse extends StandardResponse {
  @ApiProperty({ type: () => ListProjectChatQuestionRecommendationsData })
  data: ListProjectChatQuestionRecommendationsData;

  @ApiProperty({ type: () => PaginationMetaResponse })
  meta: PaginationMetaResponse;
}

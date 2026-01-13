import type { ProjectChatQuestionRecommendations } from '@infra/db/db';
import type { DBModel } from '@infra/db/db.common';

import type {
  Plain,
  Serialized,
  WithPgState,
} from '@shared/common/common.type';

import type { ProjectChatQuestionRecommendation } from './project-chat-question-recommendation.domain';

export type ProjectChatQuestionRecommendationPg =
  DBModel<ProjectChatQuestionRecommendations>;
export type ProjectChatQuestionRecommendationPlain =
  Plain<ProjectChatQuestionRecommendation>;

export type ProjectChatQuestionRecommendationJson =
  Serialized<ProjectChatQuestionRecommendationPlain>;
export type ProjectChatQuestionRecommendationJsonState = WithPgState<
  ProjectChatQuestionRecommendationJson,
  ProjectChatQuestionRecommendationPg
>;

export type ProjectChatQuestionRecommendationNewData = {
  data: {
    questionText: string;
    projectId: string;
  };
};

export type ProjectChatQuestionRecommendationUpdateData = {
  data: {
    questionText?: string;
  };
};

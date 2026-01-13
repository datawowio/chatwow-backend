import { DomainEntity } from '@shared/common/common.domain';
import { isDefined } from '@shared/common/common.validator';

import {
  projectChatQuestionRecommendationFromPlain,
  projectChatQuestionRecommendationToPlain,
} from './project-chat-question-recommendation.mapper';
import type {
  ProjectChatQuestionRecommendationPg,
  ProjectChatQuestionRecommendationPlain,
  ProjectChatQuestionRecommendationUpdateData,
} from './project-chat-question-recommendation.type';

export class ProjectChatQuestionRecommendation extends DomainEntity<ProjectChatQuestionRecommendationPg> {
  readonly id: string;
  readonly createdAt: Date;
  readonly questionText: string;
  readonly projectId: string;

  constructor(plain: ProjectChatQuestionRecommendationPlain) {
    super();
    Object.assign(this, plain);
  }

  edit({ data }: ProjectChatQuestionRecommendationUpdateData) {
    const plain: ProjectChatQuestionRecommendationPlain = {
      id: this.id,
      createdAt: this.createdAt,
      questionText: isDefined(data.questionText)
        ? data.questionText
        : this.questionText,
      projectId: this.projectId,
    };

    Object.assign(this, plain);
  }

  clone() {
    return projectChatQuestionRecommendationFromPlain(
      projectChatQuestionRecommendationToPlain(this),
    );
  }
}

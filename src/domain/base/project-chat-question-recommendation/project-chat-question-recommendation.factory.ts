import { faker } from '@faker-js/faker';

import { uuidV7 } from '@shared/common/common.crypto';
import myDayjs from '@shared/common/common.dayjs';
import { valueOr } from '@shared/common/common.func';

import type { ProjectChatQuestionRecommendation } from './project-chat-question-recommendation.domain';
import { projectChatQuestionRecommendationFromPlain } from './project-chat-question-recommendation.mapper';
import type {
  ProjectChatQuestionRecommendationNewData,
  ProjectChatQuestionRecommendationPlain,
} from './project-chat-question-recommendation.type';

export function newProjectChatQuestionRecommendation({
  data,
}: ProjectChatQuestionRecommendationNewData): ProjectChatQuestionRecommendation {
  return projectChatQuestionRecommendationFromPlain({
    id: uuidV7(),
    createdAt: myDayjs().toDate(),
    questionText: data.questionText,
    projectId: data.projectId,
  });
}

export function newProjectChatQuestionRecommendations(
  data: ProjectChatQuestionRecommendationNewData[],
) {
  return data.map((d) => newProjectChatQuestionRecommendation(d));
}

export function mockProjectChatQuestionRecommendation(
  data: Partial<ProjectChatQuestionRecommendationPlain>,
) {
  return projectChatQuestionRecommendationFromPlain({
    id: valueOr(data.id, uuidV7()),
    createdAt: valueOr(data.createdAt, myDayjs().toDate()),
    questionText: valueOr(data.questionText, faker.lorem.sentence()),
    projectId: valueOr(data.projectId, uuidV7()),
  });
}

export function mockProjectChatQuestionRecommendations(
  amount: number,
  data: Partial<ProjectChatQuestionRecommendationPlain>,
) {
  return Array(amount)
    .fill(0)
    .map(() => mockProjectChatQuestionRecommendation(data));
}

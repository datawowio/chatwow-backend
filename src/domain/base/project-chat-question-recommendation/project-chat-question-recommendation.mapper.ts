import {
  toDate,
  toISO,
  toResponseDate,
} from '@shared/common/common.transformer';

import { ProjectChatQuestionRecommendation } from './project-chat-question-recommendation.domain';
import type { ProjectChatQuestionRecommendationResponse } from './project-chat-question-recommendation.response';
import type {
  ProjectChatQuestionRecommendationJson,
  ProjectChatQuestionRecommendationJsonState,
  ProjectChatQuestionRecommendationPg,
  ProjectChatQuestionRecommendationPlain,
} from './project-chat-question-recommendation.type';

export function projectChatQuestionRecommendationFromPg(
  pg: ProjectChatQuestionRecommendationPg,
): ProjectChatQuestionRecommendation {
  const plain: ProjectChatQuestionRecommendationPlain = {
    id: pg.id,
    createdAt: toDate(pg.created_at),
    questionText: pg.question_text,
    projectId: pg.project_id,
  };

  return new ProjectChatQuestionRecommendation(plain);
}

export function projectChatQuestionRecommendationFromPgWithState(
  pg: ProjectChatQuestionRecommendationPg,
): ProjectChatQuestionRecommendation {
  return projectChatQuestionRecommendationFromPg(pg).setPgState(
    projectChatQuestionRecommendationToPg,
  );
}

export function projectChatQuestionRecommendationFromPlain(
  plainData: ProjectChatQuestionRecommendationPlain,
): ProjectChatQuestionRecommendation {
  const plain: ProjectChatQuestionRecommendationPlain = {
    id: plainData.id,
    createdAt: plainData.createdAt,
    questionText: plainData.questionText,
    projectId: plainData.projectId,
  };

  return new ProjectChatQuestionRecommendation(plain);
}

export function projectChatQuestionRecommendationFromJson(
  json: ProjectChatQuestionRecommendationJson,
): ProjectChatQuestionRecommendation {
  const plain: ProjectChatQuestionRecommendationPlain = {
    id: json.id,
    createdAt: toDate(json.createdAt),
    questionText: json.questionText,
    projectId: json.projectId,
  };

  return new ProjectChatQuestionRecommendation(plain);
}

export function projectChatQuestionRecommendationFromJsonState(
  jsonState: ProjectChatQuestionRecommendationJsonState,
) {
  const domain = projectChatQuestionRecommendationFromJson(jsonState.data);
  domain.setPgState(jsonState.state);

  return domain;
}

export function projectChatQuestionRecommendationToPg(
  domain: ProjectChatQuestionRecommendation,
): ProjectChatQuestionRecommendationPg {
  return {
    id: domain.id,
    created_at: toISO(domain.createdAt),
    question_text: domain.questionText,
    project_id: domain.projectId,
  };
}

export function projectChatQuestionRecommendationToPlain(
  domain: ProjectChatQuestionRecommendation,
): ProjectChatQuestionRecommendationPlain {
  return {
    id: domain.id,
    createdAt: domain.createdAt,
    questionText: domain.questionText,
    projectId: domain.projectId,
  };
}

export function projectChatQuestionRecommendationToJson(
  domain: ProjectChatQuestionRecommendation,
): ProjectChatQuestionRecommendationJson {
  return {
    id: domain.id,
    createdAt: toISO(domain.createdAt),
    questionText: domain.questionText,
    projectId: domain.projectId,
  };
}

export function projectChatQuestionRecommendationToJsonState(
  domain: ProjectChatQuestionRecommendation,
): ProjectChatQuestionRecommendationJsonState {
  return {
    state: domain.pgState,
    data: projectChatQuestionRecommendationToJson(domain),
  };
}

export function projectChatQuestionRecommendationToResponse(
  domain: ProjectChatQuestionRecommendation,
): ProjectChatQuestionRecommendationResponse {
  return {
    id: domain.id,
    createdAt: toResponseDate(domain.createdAt),
    questionText: domain.questionText,
    projectId: domain.projectId,
  };
}

export function projectChatQuestionRecommendationPgToResponse(
  pg: ProjectChatQuestionRecommendationPg,
): ProjectChatQuestionRecommendationResponse {
  return {
    id: pg.id,
    createdAt: toResponseDate(pg.created_at),
    questionText: pg.question_text,
    projectId: pg.project_id,
  };
}

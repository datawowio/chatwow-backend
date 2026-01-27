import type { EB } from '@infra/db/db.common';

export function projectChatQuestionRecommendationsTableFilter(
  eb: EB<'project_chat_question_recommendations'>,
) {
  // no base filter
  return eb.and([]);
}

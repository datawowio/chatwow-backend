import { Module } from '@nestjs/common';

import { ProjectChatQuestionRecommendationService } from './project-chat-question-recommendation.service';

@Module({
  providers: [ProjectChatQuestionRecommendationService],
  exports: [ProjectChatQuestionRecommendationService],
})
export class ProjectChatQuestionRecommendationModule {}

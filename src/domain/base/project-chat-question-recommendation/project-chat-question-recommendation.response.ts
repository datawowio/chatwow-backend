import { ApiProperty } from '@nestjs/swagger';

import { DATE_EXAMPLE, UUID_EXAMPLE } from '@shared/common/common.constant';

export class ProjectChatQuestionRecommendationResponse {
  @ApiProperty({ example: UUID_EXAMPLE })
  id: string;

  @ApiProperty({ example: DATE_EXAMPLE })
  createdAt: string;

  @ApiProperty({ example: 'What is this project about?' })
  questionText: string;

  @ApiProperty({ example: UUID_EXAMPLE })
  projectId: string;
}

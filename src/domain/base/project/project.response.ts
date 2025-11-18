import { ApiProperty } from '@nestjs/swagger';

import { ProjectStatus } from '@infra/db/db';

import { DATE_EXAMPLE, UUID_EXAMPLE } from '@shared/common/common.constant';

export class ProjectResponse {
  @ApiProperty({ example: UUID_EXAMPLE })
  id: string;

  @ApiProperty({ example: DATE_EXAMPLE })
  createdAt: string;

  @ApiProperty({ example: DATE_EXAMPLE })
  updatedAt: string;

  @ApiProperty({ example: 'My Project' })
  projectName: string;

  @ApiProperty({ example: 'Project description' })
  projectDescription: string;

  @ApiProperty({ example: '# Guidelines' })
  projectGuidelineMd: string;

  @ApiProperty({ example: 'ACTIVE' })
  projectStatus: ProjectStatus;

  @ApiProperty({ example: 'this is readme summary' })
  aiSummaryMd: string;
}

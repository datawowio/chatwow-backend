import { PROJECT_STATUS } from '@domain/base/project/project.constant';
import { ProjectResponse } from '@domain/base/project/project.response';
import { ApiProperty } from '@nestjs/swagger';
import z from 'zod';

import { IDomainData } from '@shared/common/common.type';
import { StandardResponse } from '@shared/http/http.response.dto';
import { zodDto } from '@shared/zod/zod.util';

// ================ Request ================

const zod = z.object({
  project: z
    .object({
      projectName: z.string().optional(),
      projectDescription: z.string().optional(),
      aiSummaryMd: z.string().optional(),
      projectStatus: z.enum(PROJECT_STATUS).optional(),
    })
    .optional(),
});

export class EditProjectDto extends zodDto(zod) {}

// ================ Response ================

class EditProjectProject implements IDomainData {
  @ApiProperty({ type: () => ProjectResponse })
  attributes: ProjectResponse;
}

export class EditProjectData {
  @ApiProperty({ type: () => EditProjectProject })
  project: EditProjectProject;
}

export class EditProjectResponse extends StandardResponse {
  @ApiProperty({ type: () => EditProjectData })
  data: EditProjectData;
}

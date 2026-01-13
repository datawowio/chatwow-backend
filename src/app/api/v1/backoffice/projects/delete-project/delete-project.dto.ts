import { ProjectResponse } from '@domain/base/project/project.response';
import { ApiProperty } from '@nestjs/swagger';

import { IDomainData } from '@shared/common/common.type';
import { StandardResponse } from '@shared/http/http.response.dto';

// ================ Request ================

// ================ Response ================

class DeleteProjectProject implements IDomainData {
  @ApiProperty({ type: () => ProjectResponse })
  attributes: ProjectResponse;
}

export class DeleteProjectData {
  @ApiProperty({ type: () => DeleteProjectProject })
  project: DeleteProjectProject;
}

export class DeleteProjectResponse extends StandardResponse {
  @ApiProperty({ type: () => DeleteProjectData })
  data: DeleteProjectData;
}

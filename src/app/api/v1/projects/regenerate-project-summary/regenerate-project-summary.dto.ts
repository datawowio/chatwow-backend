import { ProjectResponse } from '@domain/base/project/project.response';
import { ApiProperty } from '@nestjs/swagger';

import { IDomainData } from '@shared/common/common.type';
import { StandardResponse } from '@shared/http/http.response.dto';

// ================ Request ================

// ================ Response ================

class RegenerateProjectSummaryProject implements IDomainData {
  @ApiProperty({ type: () => ProjectResponse })
  attributes: ProjectResponse;
}

export class RegenerateProjectSummaryData {
  @ApiProperty({ type: () => RegenerateProjectSummaryProject })
  project: RegenerateProjectSummaryProject;
}

export class RegenerateProjectSummaryResponse extends StandardResponse {
  @ApiProperty({ type: () => RegenerateProjectSummaryData })
  data: RegenerateProjectSummaryData;
}

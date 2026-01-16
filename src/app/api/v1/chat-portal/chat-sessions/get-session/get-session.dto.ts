import { ProjectChatSessionResponse } from '@domain/base/project-chat-session/project-chat-session.response';
import { ProjectResponse } from '@domain/base/project/project.response';
import { ApiProperty } from '@nestjs/swagger';
import z from 'zod';

import { IDomainData } from '@shared/common/common.type';
import { StandardResponse } from '@shared/http/http.response.dto';
import { zodDto } from '@shared/zod/zod.util';

import { getSessionIncludesZod } from './get-session.util';

// =========== Request ===========

const zod = z.object({
  includes: getSessionIncludesZod,
});

export class GetSessionDto extends zodDto(zod) {}

// ========== Response ==========

class ProjectChatSessionProjectData implements IDomainData {
  @ApiProperty({ type: () => ProjectResponse })
  attributes: ProjectResponse;
}

class ProjectChatSessionRelations {
  @ApiProperty({ type: () => ProjectChatSessionProjectData })
  project?: ProjectChatSessionProjectData;
}

class ProjectChatSessionData implements IDomainData {
  @ApiProperty({ type: () => ProjectChatSessionResponse })
  attributes: ProjectChatSessionResponse;

  relations: ProjectChatSessionRelations;
}

class GetSessionResponseData {
  @ApiProperty({ type: () => ProjectChatSessionData })
  projectChatSession: ProjectChatSessionData;
}

export class GetSessionResponse extends StandardResponse {
  @ApiProperty({ type: () => GetSessionResponseData })
  data: GetSessionResponseData;
}

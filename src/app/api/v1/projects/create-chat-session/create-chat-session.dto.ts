import { ProjectChatSessionResponse } from '@domain/base/project-chat-session/project-chat-session.response';
import { ProjectResponse } from '@domain/base/project/project.response';
import { ApiProperty } from '@nestjs/swagger';

import { IDomainData } from '@shared/common/common.type';
import { StandardResponse } from '@shared/http/http.response.dto';

// ================ Request ================

// ================ Response ================

class CreateChatSessionProjectData implements IDomainData {
  @ApiProperty({ type: () => ProjectResponse })
  attributes: ProjectResponse;
}

class CreateChatSessionProjectRelations {
  @ApiProperty({ type: () => CreateChatSessionProjectData })
  project: CreateChatSessionProjectData;
}

class CreateChatSessionProject implements IDomainData {
  @ApiProperty({ type: () => ProjectChatSessionResponse })
  attributes: ProjectChatSessionResponse;

  @ApiProperty({ type: () => CreateChatSessionProjectRelations })
  relations?: CreateChatSessionProjectRelations;
}

export class CreateChatSessionData {
  @ApiProperty({ type: () => CreateChatSessionProject })
  projectChatSession: CreateChatSessionProject;
}

export class CreateChatSessionResponse extends StandardResponse {
  @ApiProperty({ type: () => CreateChatSessionData })
  data: CreateChatSessionData;
}

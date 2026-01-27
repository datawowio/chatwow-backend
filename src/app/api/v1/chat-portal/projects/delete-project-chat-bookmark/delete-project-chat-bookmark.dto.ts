import { ProjectChatBookmarkResponse } from '@domain/base/project-chat-bookmark/project-chat-bookmark.response';
import { ProjectResponse } from '@domain/base/project/project.response';
import { ApiProperty } from '@nestjs/swagger';

import { IDomainData } from '@shared/common/common.type';
import { StandardResponse } from '@shared/http/http.response.dto';

// =============== Response ================

class DeleteProjectChatBookmarkProjectData implements IDomainData {
  @ApiProperty({ type: () => ProjectResponse })
  attributes: ProjectResponse;
}

class DeleteProjectChatBookmarkProjectRelations {
  @ApiProperty({ type: () => DeleteProjectChatBookmarkProjectData })
  project?: DeleteProjectChatBookmarkProjectData;
}

class DeleteProjectChatBookmarkProjectChatBookmark implements IDomainData {
  @ApiProperty({ type: () => ProjectChatBookmarkResponse })
  attributes: ProjectChatBookmarkResponse;

  @ApiProperty({
    type: () => DeleteProjectChatBookmarkProjectRelations,
  })
  relations: DeleteProjectChatBookmarkProjectRelations;
}

class DeleteProjectChatBookmarkData {
  @ApiProperty({ type: () => DeleteProjectChatBookmarkProjectChatBookmark })
  projectChatBookmark: DeleteProjectChatBookmarkProjectChatBookmark;
}

export class DeleteProjectChatBookmarkResponse extends StandardResponse {
  @ApiProperty({ type: () => DeleteProjectChatBookmarkData })
  data: DeleteProjectChatBookmarkData;
}

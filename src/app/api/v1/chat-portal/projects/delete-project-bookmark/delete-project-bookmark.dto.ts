import { ProjectChatBookmarkResponse } from '@domain/base/project-chat-bookmark/project-chat-bookmark.response';
import { ProjectResponse } from '@domain/base/project/project.response';
import { ApiProperty } from '@nestjs/swagger';
import z from 'zod';

import { IDomainData } from '@shared/common/common.type';
import { StandardResponse } from '@shared/http/http.response.dto';
import { zodDto } from '@shared/zod/zod.util';

const zod = z.object({
  bookmarkText: z.string().min(1).max(500),
});

export class DeleteProjectBookmarkDto extends zodDto(zod) {}

// =============== Response ================

class DeleteProjectBookmarkProjectData implements IDomainData {
  @ApiProperty({ type: () => ProjectResponse })
  attributes: ProjectResponse;
}

class DeleteProjectBookmarkProjectRelations {
  @ApiProperty({ type: () => DeleteProjectBookmarkProjectData })
  project?: DeleteProjectBookmarkProjectData;
}

class DeleteProjectBookmarkProjectBookmark implements IDomainData {
  @ApiProperty({ type: () => ProjectChatBookmarkResponse })
  attributes: ProjectChatBookmarkResponse;

  @ApiProperty({
    type: () => DeleteProjectBookmarkProjectRelations,
  })
  relations: DeleteProjectBookmarkProjectRelations;
}

class DeleteProjectBookmarkData {
  @ApiProperty({ type: () => DeleteProjectBookmarkProjectBookmark })
  projectBookmark: DeleteProjectBookmarkProjectBookmark;
}

export class DeleteProjectBookmarkResponse extends StandardResponse {
  @ApiProperty({ type: () => DeleteProjectBookmarkData })
  data: DeleteProjectBookmarkData;
}

import { ProjectChatBookmarkResponse } from '@domain/base/project-chat-bookmark/project-chat-bookmark.response';
import { ApiProperty } from '@nestjs/swagger';
import z from 'zod';

import { IDomainData } from '@shared/common/common.type';
import { StandardResponse } from '@shared/http/http.response.dto';
import { zodDto } from '@shared/zod/zod.util';

const zod = z.object({
  bookmarkText: z.string().min(1).max(500),
});

export class CreateProjectChatBookmarkDto extends zodDto(zod) {}

// =============== Response ================

class CreateProjectChatBookmarkProjectChatBookmark implements IDomainData {
  @ApiProperty({ type: () => ProjectChatBookmarkResponse })
  attributes: ProjectChatBookmarkResponse;
}

class CreateProjectChatBookmarkData {
  @ApiProperty({ type: () => CreateProjectChatBookmarkProjectChatBookmark })
  projectChatBookmark: CreateProjectChatBookmarkProjectChatBookmark;
}

export class CreateProjectChatBookmarkResponse extends StandardResponse {
  @ApiProperty({ type: () => CreateProjectChatBookmarkData })
  data: CreateProjectChatBookmarkData;
}

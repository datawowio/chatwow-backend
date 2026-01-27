import { ProjectChatLogResponse } from '@domain/base/project-chat-log/project-chat-log.response';
import { ProjectChatSessionResponse } from '@domain/base/project-chat-session/project-chat-session.response';
import { projectChatSessionFilterZod } from '@domain/base/project-chat-session/project-chat-session.zod';
import { ApiProperty } from '@nestjs/swagger';
import z from 'zod';

import type { IDomainData } from '@shared/common/common.type';
import {
  CursorMetaResponse,
  StandardResponse,
} from '@shared/http/http.response.dto';
import { getSortZod, paginationCursorZod, zodDto } from '@shared/zod/zod.util';

import { listProjectChatSessionIncludesZod } from './list-project-chat-sessions.util';

// ================ Request ================

const zod = z.object({
  includes: listProjectChatSessionIncludesZod,
  filter: projectChatSessionFilterZod.optional(),
  pagination: paginationCursorZod,
  sort: getSortZod(['id']).optional(),
});

export class ListProjectChatSessionsDto extends zodDto(zod) {}

// ================ Response ================

export class ListProjectChatSessionsChatLog implements IDomainData {
  @ApiProperty({ type: () => ProjectChatLogResponse })
  attributes: ProjectChatLogResponse;
}

export class ListProjectChatSessionsProjectsDataRelations {
  @ApiProperty({ type: () => ListProjectChatSessionsChatLog, required: false })
  initChatLog?: ListProjectChatSessionsChatLog;

  @ApiProperty({ type: () => ListProjectChatSessionsChatLog, required: false })
  latestChatLog?: ListProjectChatSessionsChatLog;
}

export class ListProjectChatSessionsProjectsData implements IDomainData {
  @ApiProperty({ type: () => ProjectChatSessionResponse })
  attributes: ProjectChatSessionResponse;

  @ApiProperty({ type: () => ListProjectChatSessionsProjectsDataRelations })
  relations: ListProjectChatSessionsProjectsDataRelations;
}

export class ListProjectChatSessionsData {
  @ApiProperty({
    type: () => ListProjectChatSessionsProjectsData,
    isArray: true,
  })
  projectChatSessions: ListProjectChatSessionsProjectsData[];
}

export class ListProjectChatSessionsResponse extends StandardResponse {
  @ApiProperty({ type: () => ListProjectChatSessionsData })
  data: ListProjectChatSessionsData;

  @ApiProperty({ type: () => CursorMetaResponse })
  meta: CursorMetaResponse;
}

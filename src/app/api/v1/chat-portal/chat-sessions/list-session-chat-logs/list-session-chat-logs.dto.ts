import { ProjectChatLogResponse } from '@domain/base/project-chat-log/project-chat-log.response';
import { projectChatLogFilterZod } from '@domain/base/project-chat-log/project-chat-log.zod';
import { ApiProperty } from '@nestjs/swagger';
import z from 'zod';

import type { IDomainData } from '@shared/common/common.type';
import {
  CursorMetaResponse,
  StandardResponse,
} from '@shared/http/http.response.dto';
import { getSortZod, paginationCursorZod, zodDto } from '@shared/zod/zod.util';

// ================ Request ================

const zod = z.object({
  filter: projectChatLogFilterZod.optional(),
  pagination: paginationCursorZod,
  sort: getSortZod(['id']).optional(),
});

export class ListSessionChatLogsDto extends zodDto(zod) {}

// ================ Response ================

export class ListSessionChatLogsProjectsData implements IDomainData {
  @ApiProperty({ type: () => ProjectChatLogResponse })
  attributes: ProjectChatLogResponse;

  @ApiProperty()
  relations: object;
}

export class ListSessionChatLogsData {
  @ApiProperty({ type: () => ListSessionChatLogsProjectsData, isArray: true })
  projectChatLogs: ListSessionChatLogsProjectsData[];
}

export class ListSessionChatLogsResponse extends StandardResponse {
  @ApiProperty({ type: () => ListSessionChatLogsData })
  data: ListSessionChatLogsData;

  @ApiProperty({ type: () => CursorMetaResponse })
  meta: CursorMetaResponse;
}

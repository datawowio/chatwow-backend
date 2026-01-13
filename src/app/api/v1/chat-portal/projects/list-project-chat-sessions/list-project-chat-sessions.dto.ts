import { ProjectResponse } from '@domain/base/project/project.response';
import {
  projectFilterZod,
  projectSortZod,
} from '@domain/base/project/project.zod';
import { ApiProperty } from '@nestjs/swagger';
import z from 'zod';

import type { IDomainData } from '@shared/common/common.type';
import {
  PaginationMetaResponse,
  StandardResponse,
} from '@shared/http/http.response.dto';
import { paginationZod, zodDto } from '@shared/zod/zod.util';

// ================ Request ================

const zod = z.object({
  sort: projectSortZod,
  filter: projectFilterZod,
  countFilter: projectFilterZod,
  pagination: paginationZod,
});

export class ListProjectChatSessionsDto extends zodDto(zod) {}

// ================ Response ================

export class ListProjectChatSessionsProjectsData implements IDomainData {
  @ApiProperty({ type: () => ProjectResponse })
  attributes: ProjectResponse;

  @ApiProperty()
  relations: object;
}

export class ListProjectChatSessionsData {
  @ApiProperty({
    type: () => ListProjectChatSessionsProjectsData,
    isArray: true,
  })
  projects: ListProjectChatSessionsProjectsData[];
}

export class ListProjectChatSessionsResponse extends StandardResponse {
  @ApiProperty({ type: () => ListProjectChatSessionsData })
  data: ListProjectChatSessionsData;

  @ApiProperty({ type: () => PaginationMetaResponse })
  meta: PaginationMetaResponse;
}

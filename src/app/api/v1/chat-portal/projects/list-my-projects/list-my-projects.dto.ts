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

export class ListMyProjectsDto extends zodDto(zod) {}

// ================ Response ================

export class ListMyProjectsProjectsData implements IDomainData {
  @ApiProperty({ type: () => ProjectResponse })
  attributes: ProjectResponse;

  @ApiProperty()
  relations: object;
}

export class ListMyProjectsData {
  @ApiProperty({ type: () => ListMyProjectsProjectsData, isArray: true })
  projects: ListMyProjectsProjectsData[];
}

export class ListMyProjectsResponse extends StandardResponse {
  @ApiProperty({ type: () => ListMyProjectsData })
  data: ListMyProjectsData;

  @ApiProperty({ type: () => PaginationMetaResponse })
  meta: PaginationMetaResponse;
}

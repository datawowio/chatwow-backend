import { ProjectDocumentResponse } from '@domain/base/project-document/project-document.response';
import { ProjectResponse } from '@domain/base/project/project.response';
import { UserGroupResponse } from '@domain/base/user-group/user-group.response';
import { UserResponse } from '@domain/base/user/user.response';
import { ApiProperty } from '@nestjs/swagger';
import z from 'zod';

import type { IDomainData } from '@shared/common/common.type';
import { StandardResponse } from '@shared/http/http.response.dto';
import { zodDto } from '@shared/zod/zod.util';

import { projectsV1IncludesZod } from '../projects.v1.util';

// ================ Request ================

const zod = z.object({
  includes: projectsV1IncludesZod,
});

export class GetProjectDto extends zodDto(zod) {}

// ================ Response ================

export class GetProjectProjectUserGroups implements IDomainData {
  @ApiProperty({ type: () => UserGroupResponse })
  attributes: UserGroupResponse;
}

export class GetProjectProjectManageUsers implements IDomainData {
  @ApiProperty({ type: () => UserResponse })
  attributes: UserResponse;
}

export class GetProjectProjectProjectDocuments implements IDomainData {
  @ApiProperty({ type: () => ProjectDocumentResponse })
  attributes: ProjectDocumentResponse;
}

export class GetProjectProjectRelations {
  @ApiProperty({
    type: () => GetProjectProjectProjectDocuments,
    isArray: true,
  })
  projectDocuments?: GetProjectProjectProjectDocuments[];

  @ApiProperty({
    type: () => GetProjectProjectUserGroups,
    isArray: true,
  })
  userGroups?: GetProjectProjectUserGroups[];

  @ApiProperty({
    type: () => GetProjectProjectManageUsers,
    isArray: true,
  })
  manageUsers?: GetProjectProjectManageUsers[];
}

export class GetProjectProjectData implements IDomainData {
  @ApiProperty({ type: () => ProjectResponse })
  attributes: ProjectResponse;

  @ApiProperty({ type: () => GetProjectProjectRelations })
  relations: GetProjectProjectRelations;
}

export class GetProjectData {
  @ApiProperty({ type: () => GetProjectProjectData })
  project: GetProjectProjectData;
}

export class GetProjectResponse extends StandardResponse {
  @ApiProperty({ type: () => GetProjectData })
  data: GetProjectData;
}

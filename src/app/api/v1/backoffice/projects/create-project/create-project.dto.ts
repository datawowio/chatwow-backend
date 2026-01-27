import { ProjectDocumentResponse } from '@domain/base/project-document/project-document.response';
import { ProjectResponse } from '@domain/base/project/project.response';
import { StoredFileResponse } from '@domain/base/stored-file/stored-file.response';
import { storedFileZod } from '@domain/base/stored-file/stored-file.zod';
import { UserGroupResponse } from '@domain/base/user-group/user-group.response';
import { UserResponse } from '@domain/base/user/user.response';
import { ApiProperty } from '@nestjs/swagger';
import z from 'zod';

import { IDomainData } from '@shared/common/common.type';
import { StandardResponse } from '@shared/http/http.response.dto';
import { zodDto } from '@shared/zod/zod.util';

// ================ Request ================

const zod = z.object({
  project: z.object({
    projectName: z.string(),
    projectDescription: z.string(),
  }),
  projectDocuments: z
    .array(
      z.object({
        documentDetails: z.string(),
        storedFile: storedFileZod,
      }),
    )
    .optional(),
  manageUserIds: z.array(z.string().uuid()).optional(),
  userGroupIds: z.array(z.string()).optional(),
});

export class CreateProjectDto extends zodDto(zod) {}

// ================ Response ================

class CreateProjectProjectManageUser implements IDomainData {
  @ApiProperty({ type: () => UserResponse })
  attributes: UserResponse;
}

class CreateProjectProjectUserGroup implements IDomainData {
  @ApiProperty({ type: () => UserGroupResponse })
  attributes: UserGroupResponse;
}

class CreateProjectProjectDocumentStoredFiles implements IDomainData {
  @ApiProperty({ type: () => StoredFileResponse })
  attributes: StoredFileResponse;
}

class CreateProjectProjectProjectDocumentRelations {
  @ApiProperty({
    type: () => CreateProjectProjectDocumentStoredFiles,
    isArray: true,
  })
  storedFile?: CreateProjectProjectDocumentStoredFiles;
}

class CreateProjectProjectProjectDocument implements IDomainData {
  @ApiProperty({ type: () => ProjectDocumentResponse })
  attributes: ProjectDocumentResponse;

  @ApiProperty({ type: () => CreateProjectProjectProjectDocumentRelations })
  relations?: CreateProjectProjectProjectDocumentRelations;
}

class CreateProjectProjectRelations {
  @ApiProperty({ type: () => CreateProjectProjectManageUser, isArray: true })
  manageUsers?: CreateProjectProjectManageUser[];

  @ApiProperty({ type: () => CreateProjectProjectUserGroup, isArray: true })
  userGroups?: CreateProjectProjectUserGroup[];

  @ApiProperty({
    type: () => CreateProjectProjectProjectDocument,
    isArray: true,
  })
  projectDocuments?: CreateProjectProjectProjectDocument[];
}

class CreateProjectProject implements IDomainData {
  @ApiProperty({ type: () => ProjectResponse })
  attributes: ProjectResponse;

  @ApiProperty({ type: () => CreateProjectProjectRelations })
  relations?: CreateProjectProjectRelations;
}

export class CreateProjectData {
  @ApiProperty({ type: () => CreateProjectProject })
  project: CreateProjectProject;
}

export class CreateProjectResponse extends StandardResponse {
  @ApiProperty({ type: () => CreateProjectData })
  data: CreateProjectData;
}

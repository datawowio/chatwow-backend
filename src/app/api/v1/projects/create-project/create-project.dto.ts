import { ProjectDocumentResponse } from '@domain/base/project-document/project-document.response';
import { ProjectResponse } from '@domain/base/project/project.response';
import { StoredFileResponse } from '@domain/base/stored-file/stored-file.response';
import { createStoredFileZod } from '@domain/base/stored-file/stored-file.zod';
import { UserGroupResponse } from '@domain/base/user-group/user-group.response';
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
  projectDocuments: z.array(
    z.object({
      documentDetails: z.string(),
      storedFile: createStoredFileZod,
    }),
  ),
  userGroupIds: z.array(z.string()),
});

export class CreateProjectDto extends zodDto(zod) {}

// ================ Response ================

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

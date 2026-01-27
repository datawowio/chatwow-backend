import { PROJECT_STATUS } from '@domain/base/project/project.constant';
import { ProjectResponse } from '@domain/base/project/project.response';
import { UserGroupResponse } from '@domain/base/user-group/user-group.response';
import { UserResponse } from '@domain/base/user/user.response';
import { ApiProperty } from '@nestjs/swagger';
import z from 'zod';

import { IDomainData } from '@shared/common/common.type';
import { StandardResponse } from '@shared/http/http.response.dto';
import { zodDto } from '@shared/zod/zod.util';

// ================ Request ================

const zod = z.object({
  project: z
    .object({
      projectName: z.string().optional(),
      projectDescription: z.string().optional(),
      aiSummaryMd: z.string().optional(),
      projectStatus: z.enum(PROJECT_STATUS).optional(),
    })
    .optional(),
  manageUserIds: z.array(z.string().uuid()).optional(),
  userGroupIds: z.array(z.string().uuid()).optional(),
});

export class EditProjectDto extends zodDto(zod) {}

// ================ Response ================

class EditProjectManageUsers implements IDomainData {
  @ApiProperty({ type: () => UserResponse })
  attributes: UserResponse;
}

class EditProjectUserGroups implements IDomainData {
  @ApiProperty({ type: () => UserGroupResponse })
  attributes: UserGroupResponse;
}

class EditProjectProjectRelations {
  @ApiProperty({ type: () => EditProjectManageUsers, isArray: true })
  manageUsers?: EditProjectManageUsers[];

  @ApiProperty({ type: () => EditProjectUserGroups, isArray: true })
  userGroups?: EditProjectUserGroups[];
}

class EditProjectProject implements IDomainData {
  @ApiProperty({ type: () => ProjectResponse })
  attributes: ProjectResponse;

  @ApiProperty({ type: () => EditProjectProjectRelations })
  relations: EditProjectProjectRelations;
}

export class EditProjectData {
  @ApiProperty({ type: () => EditProjectProject })
  project: EditProjectProject;
}

export class EditProjectResponse extends StandardResponse {
  @ApiProperty({ type: () => EditProjectData })
  data: EditProjectData;
}

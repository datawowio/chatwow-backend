import { Project } from '@domain/base/project/project.domain';
import { projectToResponse } from '@domain/base/project/project.mapper';
import { ProjectService } from '@domain/base/project/project.service';
import { UserGroupProjectService } from '@domain/base/user-group-project/user-group-project.service';
import { UserGroup } from '@domain/base/user-group/user-group.domain';
import { userGroupToResponse } from '@domain/base/user-group/user-group.mapper';
import { UserGroupService } from '@domain/base/user-group/user-group.service';
import { UserManageProjectService } from '@domain/base/user-manage-project/user-manage-project.service';
import { User } from '@domain/base/user/user.domain';
import { userToResponse } from '@domain/base/user/user.mapper';
import { UserService } from '@domain/base/user/user.service';
import { Injectable } from '@nestjs/common';

import { TransactionService } from '@infra/db/transaction/transaction.service';
import { UserClaims } from '@infra/middleware/jwt/jwt.common';

import { CommandInterface } from '@shared/common/common.type';
import { ApiException } from '@shared/http/http.exception';
import { toHttpSuccess } from '@shared/http/http.mapper';

import { EditProjectDto, EditProjectResponse } from './edit-project.dto';

type Entity = {
  project: Project;
  manageUsers?: User[];
  userGroups?: UserGroup[];
};

@Injectable()
export class EditProjectCommand implements CommandInterface {
  constructor(
    private projectService: ProjectService,
    private userService: UserService,
    private userGroupService: UserGroupService,

    private userManageProjectService: UserManageProjectService,
    private userGroupProjectService: UserGroupProjectService,

    private transactionService: TransactionService,
  ) {}

  async exec(
    claims: UserClaims,
    id: string,
    body: EditProjectDto,
  ): Promise<EditProjectResponse> {
    const entity = await this.find(claims, id);

    if (body.manageUserIds) {
      entity.manageUsers = await this.userService.findMany(body.manageUserIds);

      if (entity.manageUsers.length !== body.manageUserIds.length) {
        throw new ApiException(400, 'usersNotFound');
      }
    }

    if (body.userGroupIds) {
      entity.userGroups = await this.userGroupService.findMany(
        body.userGroupIds,
      );

      if (entity.userGroups.length !== body.userGroupIds.length) {
        throw new ApiException(400, 'userGroupsNotFound');
      }
    }

    if (body.project) {
      entity.project.edit({
        data: body.project,
        actorId: claims.userId,
      });
    }

    await this.save(entity);

    return toHttpSuccess({
      data: {
        project: {
          attributes: projectToResponse(entity.project),
          relations: {
            manageUsers: entity.manageUsers
              ? entity.manageUsers.map((u) => ({
                  attributes: userToResponse(u),
                }))
              : undefined,
            userGroups: entity.userGroups
              ? entity.userGroups.map((ug) => ({
                  attributes: userGroupToResponse(ug),
                }))
              : undefined,
          },
        },
      },
    });
  }

  async save(entity: Entity): Promise<void> {
    await this.transactionService.transaction(async () => {
      await this.projectService.save(entity.project);

      if (entity.manageUsers) {
        await this.userManageProjectService.saveProjectRelations(
          entity.project.id,
          entity.manageUsers.map((u) => u.id),
        );
      }

      if (entity.userGroups) {
        await this.userGroupProjectService.saveProjectRelations(
          entity.project.id,
          entity.userGroups.map((ug) => ug.id),
        );
      }
    });
  }

  async find(claims: UserClaims, id: string): Promise<Entity> {
    const project = await this.projectService.findOne(id, claims);

    if (!project) {
      throw new ApiException(400, 'projectNotFound');
    }

    return {
      project,
    };
  }
}

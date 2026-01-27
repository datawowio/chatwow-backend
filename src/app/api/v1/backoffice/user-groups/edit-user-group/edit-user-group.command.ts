import { Project } from '@domain/base/project/project.domain';
import {
  projectFromPgWithState,
  projectToResponse,
} from '@domain/base/project/project.mapper';
import { projectsTableFilter } from '@domain/base/project/project.util';
import { UserGroupManagerService } from '@domain/base/user-group-manager/user-group-manager.service';
import { UserGroupProjectService } from '@domain/base/user-group-project/user-group-project.service';
import { UserGroupUserService } from '@domain/base/user-group-user/user-group-user.service';
import { UserGroup } from '@domain/base/user-group/user-group.domain';
import { userGroupToResponse } from '@domain/base/user-group/user-group.mapper';
import { UserGroupService } from '@domain/base/user-group/user-group.service';
import { User } from '@domain/base/user/user.domain';
import {
  userFromPgWithState,
  userToResponse,
} from '@domain/base/user/user.mapper';
import { usersTableFilter } from '@domain/base/user/user.util';
import { Injectable } from '@nestjs/common';

import { MainDb } from '@infra/db/db.main';
import { TransactionService } from '@infra/db/transaction/transaction.service';
import { UserClaims } from '@infra/middleware/jwt/jwt.common';

import { CommandInterface } from '@shared/common/common.type';
import { ApiException } from '@shared/http/http.exception';

import { EditUserGroupDto, EditUserGroupResponse } from './edit-user-group.dto';

type Entity = {
  userGroup: UserGroup;
  users?: User[];
  manageUsers?: User[];
  projects?: Project[];
};

@Injectable()
export class EditUserGroupCommand implements CommandInterface {
  constructor(
    private db: MainDb,

    private userGroupsService: UserGroupService,
    private userGroupUsersService: UserGroupUserService,
    private userGroupManagerService: UserGroupManagerService,
    private userGroupProjectsService: UserGroupProjectService,
    private transactionService: TransactionService,
  ) {}

  async exec(
    claims: UserClaims,
    id: string,
    body: EditUserGroupDto,
  ): Promise<EditUserGroupResponse> {
    const userGroup = await this.find(claims, id);

    if (body.userGroup) {
      userGroup.edit({
        actorId: claims.userId,
        data: body.userGroup,
      });
    }

    const entity: Entity = {
      userGroup,
      users: body.userIds ? await this.findUsers(body.userIds) : undefined,
      manageUsers: body.manageUserIds
        ? await this.findUsers(body.manageUserIds, true)
        : undefined,
      projects: body.projectIds
        ? await this.findProjects(body.projectIds)
        : undefined,
    };

    await this.save(entity);

    return {
      success: true,
      key: '',
      data: {
        userGroup: {
          attributes: userGroupToResponse(entity.userGroup),
          relations: {
            users:
              entity.users &&
              entity.users.map((user) => ({
                attributes: userToResponse(user),
              })),
            manageUsers:
              entity.manageUsers &&
              entity.manageUsers.map((user) => ({
                attributes: userToResponse(user),
              })),
            projects:
              entity.projects &&
              entity.projects.map((project) => ({
                attributes: projectToResponse(project),
              })),
          },
        },
      },
    };
  }

  async save(entity: Entity): Promise<void> {
    await this.transactionService.transaction(async () => {
      await this.userGroupsService.save(entity.userGroup);

      if (entity.users) {
        await this.userGroupUsersService.saveUserGroupRelations(
          entity.userGroup.id,
          entity.users.map((u) => u.id),
        );
      }

      if (entity.manageUsers) {
        await this.userGroupManagerService.saveUserGroupRelations(
          entity.userGroup.id,
          entity.manageUsers.map((u) => u.id),
        );
      }

      if (entity.projects) {
        await this.userGroupProjectsService.saveUserGroupRelations(
          entity.userGroup.id,
          entity.projects.map((p) => p.id),
        );
      }
    });
  }

  async find(claims: UserClaims, id: string): Promise<UserGroup> {
    const userGroup = await this.userGroupsService.findOne(id, claims);
    if (!userGroup) {
      throw new ApiException(404, 'userGroupNotFound');
    }

    return userGroup;
  }

  async findUsers(userIds?: string[], forManager?: boolean) {
    if (!userIds?.length) {
      return [];
    }

    const users = await this.db.read
      .selectFrom('users')
      .where('users.id', 'in', userIds)
      .$if(!!forManager, (eb) => eb.where('role', 'in', ['MANAGER', 'ADMIN']))
      .where(usersTableFilter)
      .selectAll()
      .execute();

    if (users.length !== userIds.length) {
      throw new ApiException(404, 'someUsersNotFound');
    }

    return users.map((u) => userFromPgWithState(u));
  }

  async findProjects(projectIds?: string[]) {
    if (!projectIds?.length) {
      return [];
    }

    const projects = await this.db.read
      .selectFrom('projects')
      .where('projects.id', 'in', projectIds)
      .where(projectsTableFilter)
      .selectAll()
      .execute();

    if (projects.length !== projectIds.length) {
      throw new ApiException(404, 'someProjectsNotFound');
    }

    return projects.map((p) => projectFromPgWithState(p));
  }
}

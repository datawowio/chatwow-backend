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
import { newUserGroup } from '@domain/base/user-group/user-group.factory';
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
import { toHttpSuccess } from '@shared/http/http.mapper';

import {
  CreateUserGroupDto,
  CreateUserGroupResponse,
} from './create-user-group.dto';

type Entity = {
  userGroup: UserGroup;
  users: User[];
  manageUsers: User[];
  projects: Project[];
};

@Injectable()
export class CreateUserGroupCommand implements CommandInterface {
  constructor(
    private db: MainDb,

    private userGroupsService: UserGroupService,
    private userGroupUsersService: UserGroupUserService,
    private userGroupProjectsService: UserGroupProjectService,
    private userGroupManagerService: UserGroupManagerService,
    private transactionService: TransactionService,
  ) {}

  async exec(
    claims: UserClaims,
    body: CreateUserGroupDto,
  ): Promise<CreateUserGroupResponse> {
    const userGroup = newUserGroup({
      actorId: claims.userId,
      data: body.userGroup,
    });
    const [users, manageUsers, projects] = await Promise.all([
      this.findUsers(body.userIds),
      this.findUsers(body.manageUserIds, true),
      this.findProjects(body.projectIds),
    ]);

    await this.save({ userGroup, users, manageUsers, projects });

    return toHttpSuccess({
      data: {
        userGroup: {
          attributes: userGroupToResponse(userGroup),
          relations: {
            users: users.map((user) => ({
              attributes: userToResponse(user),
            })),
            manageUsers: manageUsers.map((user) => ({
              attributes: userToResponse(user),
            })),
            projects: projects.map((project) => ({
              attributes: projectToResponse(project),
            })),
          },
        },
      },
    });
  }

  async save(entity: Entity): Promise<void> {
    await this.transactionService.transaction(async () => {
      await this.userGroupsService.save(entity.userGroup);
      await this.userGroupUsersService.saveUserGroupRelations(
        entity.userGroup.id,
        entity.users.map((u) => u.id),
      );
      await this.userGroupManagerService.saveUserGroupRelations(
        entity.userGroup.id,
        entity.manageUsers.map((u) => u.id),
      );
      await this.userGroupProjectsService.saveUserGroupRelations(
        entity.userGroup.id,
        entity.projects.map((p) => p.id),
      );
    });
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

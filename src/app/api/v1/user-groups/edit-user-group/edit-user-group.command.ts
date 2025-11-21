import { Project } from '@domain/base/project/project.domain';
import { ProjectMapper } from '@domain/base/project/project.mapper';
import { projectsTableFilter } from '@domain/base/project/project.util';
import { UserGroupProjectService } from '@domain/base/user-group-project/user-group-project.service';
import { UserGroupUserService } from '@domain/base/user-group-user/user-group-user.service';
import { UserGroup } from '@domain/base/user-group/user-group.domain';
import { UserGroupMapper } from '@domain/base/user-group/user-group.mapper';
import { UserGroupService } from '@domain/base/user-group/user-group.service';
import { User } from '@domain/base/user/user.domain';
import { UserMapper } from '@domain/base/user/user.mapper';
import { usersTableFilter } from '@domain/base/user/user.util';
import { Inject, Injectable } from '@nestjs/common';

import { READ_DB, ReadDB } from '@infra/db/db.common';
import { TransactionService } from '@infra/global/transaction/transaction.service';
import { UserClaims } from '@infra/middleware/jwt/jwt.common';

import { CommandInterface } from '@shared/common/common.type';
import { ApiException } from '@shared/http/http.exception';

import { EditUserGroupDto, EditUserGroupResponse } from './edit-user-group.dto';

type Entity = {
  userGroup: UserGroup;
  users?: User[];
  projects?: Project[];
};

@Injectable()
export class EditUserGroupCommand implements CommandInterface {
  constructor(
    @Inject(READ_DB)
    private readDb: ReadDB,

    private userGroupsService: UserGroupService,
    private userGroupUsersService: UserGroupUserService,
    private userGroupProjectsService: UserGroupProjectService,
    private transactionService: TransactionService,
  ) {}

  async exec(
    claims: UserClaims,
    id: string,
    body: EditUserGroupDto,
  ): Promise<EditUserGroupResponse> {
    const userGroup = await this.find(id);

    if (body.userGroup) {
      userGroup.edit({
        actorId: claims.userId,
        data: body.userGroup,
      });
    }

    const entity: Entity = {
      userGroup,
      users: body.userIds ? await this.findUsers(body.userIds) : undefined,
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
          attributes: UserGroupMapper.toResponse(entity.userGroup),
          relations: {
            users:
              entity.users &&
              entity.users.map((user) => ({
                attributes: UserMapper.toResponse(user),
              })),
            projects:
              entity.projects &&
              entity.projects.map((project) => ({
                attributes: ProjectMapper.toResponse(project),
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

      if (entity.projects) {
        await this.userGroupProjectsService.saveUserGroupRelations(
          entity.userGroup.id,
          entity.projects.map((p) => p.id),
        );
      }
    });
  }

  async find(id: string): Promise<UserGroup> {
    const userGroup = await this.userGroupsService.findOne(id);
    if (!userGroup) {
      throw new ApiException(404, 'userGroupNotFound');
    }

    return userGroup;
  }

  async findUsers(userIds?: string[]) {
    if (!userIds?.length) {
      return [];
    }

    const users = await this.readDb
      .selectFrom('users')
      .where('users.id', 'in', userIds)
      .where(usersTableFilter)
      .selectAll()
      .execute();

    if (users.length !== userIds.length) {
      throw new ApiException(404, 'someUsersNotFound');
    }

    return users.map((u) => UserMapper.fromPgWithState(u));
  }

  async findProjects(projectIds?: string[]) {
    if (!projectIds?.length) {
      return [];
    }

    const projects = await this.readDb
      .selectFrom('projects')
      .where('projects.id', 'in', projectIds)
      .where(projectsTableFilter)
      .selectAll()
      .execute();

    if (projects.length !== projectIds.length) {
      throw new ApiException(404, 'someProjectsNotFound');
    }

    return projects.map((p) => ProjectMapper.fromPgWithState(p));
  }
}

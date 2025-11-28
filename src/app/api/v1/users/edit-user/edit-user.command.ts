import { Project } from '@domain/base/project/project.domain';
import { ProjectMapper } from '@domain/base/project/project.mapper';
import { projectsTableFilter } from '@domain/base/project/project.util';
import { UserGroupUserService } from '@domain/base/user-group-user/user-group-user.service';
import { UserGroup } from '@domain/base/user-group/user-group.domain';
import { UserGroupMapper } from '@domain/base/user-group/user-group.mapper';
import { userGroupsTableFilter } from '@domain/base/user-group/user-group.utils';
import { UserManageProjectService } from '@domain/base/user-manage-project/user-manage-project.service';
import { User } from '@domain/base/user/user.domain';
import { UserMapper } from '@domain/base/user/user.mapper';
import { UserService } from '@domain/base/user/user.service';
import { Inject, Injectable } from '@nestjs/common';

import { READ_DB, ReadDB } from '@infra/db/db.common';
import { TransactionService } from '@infra/global/transaction/transaction.service';
import { UserClaims } from '@infra/middleware/jwt/jwt.common';

import { CommandInterface } from '@shared/common/common.type';
import { ApiException } from '@shared/http/http.exception';
import { HttpResponseMapper } from '@shared/http/http.mapper';

import { EditUserDto, EditUserResponse } from './edit-user.dto';

type Entity = {
  user: User;
  userGroups?: UserGroup[];
  manageProjects?: Project[];
};

@Injectable()
export class EditUserCommand implements CommandInterface {
  constructor(
    @Inject(READ_DB)
    private readDb: ReadDB,
    private transactionService: TransactionService,
    private userService: UserService,
    private userGroupUserService: UserGroupUserService,
    private userManageProjectService: UserManageProjectService,
  ) {}

  async exec(
    claims: UserClaims,
    id: string,
    body: EditUserDto,
  ): Promise<EditUserResponse> {
    const entity = await this.find(id);
    if (body.user) {
      entity.user.edit({
        actorId: claims.userId,
        data: body.user,
      });
    }

    if (entity.user.role === 'USER') {
      entity.user.edit({
        data: {
          password: null,
        },
      });
    }

    if (body.userGroupIds) {
      entity.userGroups = await this.getUserGroups(body.userGroupIds);
    }

    if (body.manageProjectIds) {
      entity.manageProjects = await this.getProjects(body.manageProjectIds);
    }

    await this.save(entity);

    return HttpResponseMapper.toSuccess({
      data: {
        user: {
          attributes: UserMapper.toResponse(entity.user),
          relations: {
            userGroups:
              entity.userGroups &&
              entity.userGroups.map((g) => ({
                attributes: UserGroupMapper.toResponse(g),
              })),
          },
        },
      },
    });
  }

  async save(entity: Entity): Promise<void> {
    const user = entity.user;
    const userGroups = entity.userGroups;
    const manageProjects = entity.manageProjects;

    await this.transactionService.transaction(async () => {
      await this.userService.save(user);

      if (userGroups) {
        await this.userGroupUserService.saveUserRelations(
          user.id,
          userGroups.map((g) => g.id),
        );
      }

      if (manageProjects) {
        await this.userManageProjectService.saveUserRelations(
          user.id,
          manageProjects.map((p) => p.id),
        );
      }
    });
  }

  async find(id: string): Promise<Entity> {
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new ApiException(404, 'userNotFound');
    }

    return {
      user,
      userGroups: [],
    };
  }

  async getUserGroups(ids: string[]): Promise<UserGroup[]> {
    if (!ids.length) {
      return [];
    }

    const rawGroups = await this.readDb
      .selectFrom('user_groups')
      .selectAll()
      .where('id', 'in', ids)
      .where(userGroupsTableFilter)
      .execute();

    if (rawGroups.length !== ids.length) {
      throw new ApiException(400, 'invalidGroupId');
    }

    return rawGroups.map((g) => UserGroupMapper.fromPgWithState(g));
  }

  async getProjects(ids?: string[]) {
    if (!ids?.length) {
      return [];
    }

    const rawProjects = await this.readDb
      .selectFrom('projects')
      .selectAll()
      .where('id', 'in', ids)
      .where(projectsTableFilter)
      .execute();

    if (rawProjects.length !== ids.length) {
      throw new ApiException(400, 'invalidProjectId');
    }

    return rawProjects.map((p) => ProjectMapper.fromPgWithState(p));
  }
}

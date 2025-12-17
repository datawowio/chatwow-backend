import { PasswordResetToken } from '@domain/base/password-reset-token/password-reset-token.domain';
import { newPasswordResetToken } from '@domain/base/password-reset-token/password-reset-token.factory';
import { PasswordResetTokenService } from '@domain/base/password-reset-token/password-reset-token.service';
import { Project } from '@domain/base/project/project.domain';
import { projectFromPgWithState } from '@domain/base/project/project.mapper';
import { projectsTableFilter } from '@domain/base/project/project.util';
import { UserGroupUserService } from '@domain/base/user-group-user/user-group-user.service';
import { UserGroup } from '@domain/base/user-group/user-group.domain';
import {
  userGroupFromPgWithState,
  userGroupToResponse,
} from '@domain/base/user-group/user-group.mapper';
import { userGroupsTableFilter } from '@domain/base/user-group/user-group.utils';
import { UserManageProjectService } from '@domain/base/user-manage-project/user-manage-project.service';
import { User } from '@domain/base/user/user.domain';
import { newUser } from '@domain/base/user/user.factory';
import { userToResponse } from '@domain/base/user/user.mapper';
import { UserService } from '@domain/base/user/user.service';
import { DomainEventQueue } from '@domain/queue/domain-event/domain-event.queue';
import { Injectable } from '@nestjs/common';

import { MainDb } from '@infra/db/db.main';
import { TransactionService } from '@infra/db/transaction/transaction.service';
import { UserClaims } from '@infra/middleware/jwt/jwt.common';

import { shaHashstring } from '@shared/common/common.crypto';
import { CommandInterface } from '@shared/common/common.type';
import { ApiException } from '@shared/http/http.exception';
import { toHttpSuccess } from '@shared/http/http.mapper';

import { AddUserDto, AddUserResponse } from './add-user.dto';

type Entity = {
  user: User;
  userGroups: UserGroup[];
  manageProjects: Project[];
  passwordResetToken?: PasswordResetToken;
};

@Injectable()
export class AddUserCommand implements CommandInterface {
  constructor(
    private db: MainDb,
    private transactionService: TransactionService,
    private userService: UserService,
    private userGroupUserService: UserGroupUserService,
    private passwordResetTokenService: PasswordResetTokenService,
    private userManageProjectService: UserManageProjectService,
    private domainEventQueue: DomainEventQueue,
  ) {}

  async exec(claims: UserClaims, body: AddUserDto): Promise<AddUserResponse> {
    const user = newUser({
      actorId: claims.userId,
      data: body.user,
    });
    user.edit({
      actorId: claims.userId,
      data: {
        userStatus: 'ACTIVE',
      },
    });

    const userGroups = await this.getUserGroups(body.userGroupIds);
    const manageProjects = await this.getProjects(body.manageProjectIds);
    const entity: Entity = {
      user,
      userGroups,
      manageProjects,
    };

    const token = shaHashstring();
    if (user.isAllowLoginAccess()) {
      entity.user.edit({
        data: {
          userStatus: 'PENDING_REGISTRATION',
        },
      });
      entity.passwordResetToken = newPasswordResetToken({
        userId: user.id,
        token,
      });
    }

    await this.save(entity);

    this.domainEventQueue.jobSendVerification(user);

    if (user.isAllowLoginAccess()) {
      if (!entity.passwordResetToken) {
        // shouldn't happen
        throw new ApiException(500, 'internal');
      }

      // send reset email
      this.domainEventQueue.jobResetPassword({
        user: entity.user,
        plainToken: token,
        passwordResetToken: entity.passwordResetToken,
        action: 'newUser',
      });
    }

    return toHttpSuccess({
      data: {
        user: {
          attributes: userToResponse(entity.user),
          relations: {
            userGroups: entity.userGroups.map((g) => ({
              attributes: userGroupToResponse(g),
            })),
          },
        },
      },
    });
  }

  async save({
    user,
    userGroups,
    passwordResetToken,
    manageProjects,
  }: Entity): Promise<void> {
    await this.transactionService.transaction(async () => {
      await this.userService.save(user);

      if (userGroups.length) {
        await this.userGroupUserService.saveUserRelations(
          user.id,
          userGroups.map((g) => g.id),
        );
      }

      if (manageProjects.length) {
        await this.userManageProjectService.saveUserRelations(
          user.id,
          manageProjects.map((p) => p.id),
        );
      }

      if (passwordResetToken) {
        await this.passwordResetTokenService.save(passwordResetToken);
      }
    });
  }

  async getUserGroups(ids?: string[]): Promise<UserGroup[]> {
    if (!ids?.length) {
      return [];
    }

    const rawGroups = await this.db.read
      .selectFrom('user_groups')
      .selectAll()
      .where('id', 'in', ids)
      .where(userGroupsTableFilter)
      .execute();

    if (rawGroups.length !== ids.length) {
      throw new ApiException(400, 'invalidGroupId');
    }

    return rawGroups.map((g) => userGroupFromPgWithState(g));
  }

  async getProjects(ids?: string[]) {
    if (!ids?.length) {
      return [];
    }

    const rawProjects = await this.db.read
      .selectFrom('projects')
      .selectAll()
      .where('id', 'in', ids)
      .where(projectsTableFilter)
      .execute();

    if (rawProjects.length !== ids.length) {
      throw new ApiException(400, 'invalidProjectId');
    }

    return rawProjects.map((p) => projectFromPgWithState(p));
  }
}

import { UserGroupUserService } from '@domain/base/user-group-user/user-group-user.service';
import { UserGroup } from '@domain/base/user-group/user-group.domain';
import { UserGroupMapper } from '@domain/base/user-group/user-group.mapper';
import { userGroupsTableFilter } from '@domain/base/user-group/user-group.utils';
import { User } from '@domain/base/user/user.domain';
import { UserMapper } from '@domain/base/user/user.mapper';
import { UserService } from '@domain/base/user/user.service';
import { EventDispatch } from '@domain/orchestration/queue/event.dispatch';
import { Inject, Injectable } from '@nestjs/common';

import { READ_DB, ReadDB } from '@infra/db/db.common';
import { TransactionService } from '@infra/global/transaction/transaction.service';
import { UserClaims } from '@infra/middleware/jwt/jwt.common';

import { CommandInterface } from '@shared/common/common.type';
import { ApiException } from '@shared/http/http.exception';
import { HttpResponseMapper } from '@shared/http/http.mapper';

import { AddUserDto, AddUserResponse } from './add-user.dto';

type Entity = {
  user: User;
  userGroups: UserGroup[];
};

@Injectable()
export class AddUserCommand implements CommandInterface {
  constructor(
    @Inject(READ_DB)
    private readDb: ReadDB,
    private transactionService: TransactionService,
    private userService: UserService,
    private userGroupUserService: UserGroupUserService,
    private eventDispatch: EventDispatch,
  ) {}

  async exec(claims: UserClaims, body: AddUserDto): Promise<AddUserResponse> {
    const user = User.new({
      actorId: claims.userId,
      data: body.user,
    });
    user.edit({
      actorId: claims.userId,
      data: {
        userStatus: 'PENDING_REGISTRATION',
      },
    });

    const userGroups = await this.getUserGroups(body.userGroupIds);
    const entity: Entity = {
      user,
      userGroups,
    };

    await this.save(entity);

    this.eventDispatch.addUser(user);

    return HttpResponseMapper.toSuccess({
      data: {
        user: {
          attributes: UserMapper.toResponse(entity.user),
          relations: {
            userGroups: entity.userGroups.map((g) => ({
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

    await this.transactionService.transaction(async () => {
      await this.userService.save(user);

      if (userGroups.length) {
        await this.userGroupUserService.saveUserRelations(
          user.id,
          userGroups.map((g) => g.id),
        );
      }
    });
  }

  async getUserGroups(ids?: string[]): Promise<UserGroup[]> {
    if (!ids?.length) {
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
}

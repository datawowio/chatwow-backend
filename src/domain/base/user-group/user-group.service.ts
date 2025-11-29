import { Injectable } from '@nestjs/common';

import { MainDb } from '@infra/db/db.main';
import { addPagination, queryCount, sortQb } from '@infra/db/db.util';
import { UserClaims } from '@infra/middleware/jwt/jwt.common';

import { diff, getUniqueIds } from '@shared/common/common.func';
import { isDefined } from '@shared/common/common.validator';

import { UserGroup } from './user-group.domain';
import { userGroupFromPgWithState, userGroupToPg } from './user-group.mapper';
import {
  addUserGroupActorFilter,
  userGroupsTableFilter,
} from './user-group.utils';
import {
  UserGroupFilterOptions,
  UserGroupQueryOptions,
} from './user-group.zod';

@Injectable()
export class UserGroupService {
  constructor(private db: MainDb) {}

  async getIds(opts?: UserGroupQueryOptions) {
    const { sort, pagination, filter } = opts?.options || {};

    const qb = await this._getFilterQb({
      filter,
      actor: opts?.actor,
    })
      .$if(!!sort?.length, (q) =>
        sortQb(q, sort, {
          id: 'user_groups.id',
          createdAt: 'user_groups.created_at',
          groupName: 'user_groups.group_name',
        }),
      )
      .$call((q) => addPagination(q, pagination))
      .execute();

    return getUniqueIds(qb);
  }

  async getCount(filter?: UserGroupFilterOptions) {
    const totalCount = await this
      //
      ._getFilterQb(filter)
      .$call((q) => queryCount(q));

    return totalCount;
  }

  async findOne(id: string, actor?: UserClaims): Promise<UserGroup | null> {
    const userGroupPg = await this.db.read
      .selectFrom('user_groups')
      .selectAll('user_groups')
      .$if(!!actor, (q) => addUserGroupActorFilter(q, actor!))
      .where('id', '=', id)
      .executeTakeFirst();

    if (!userGroupPg) {
      return null;
    }

    const userGroup = userGroupFromPgWithState(userGroupPg);
    return userGroup;
  }

  async save(userGroup: UserGroup) {
    this._validate(userGroup);

    if (!userGroup.isPersist) {
      await this._create(userGroup);
    } else {
      await this._update(userGroup.id, userGroup);
    }

    userGroup.setPgState(userGroupToPg);
  }

  async saveBulk(userGroups: UserGroup[]) {
    return Promise.all(userGroups.map((u) => this.save(u)));
  }

  async delete(id: string) {
    await this.db.write
      //
      .deleteFrom('user_groups')
      .where('id', '=', id)
      .execute();
  }

  private async _create(userGroup: UserGroup): Promise<void> {
    await this.db.write
      //
      .insertInto('user_groups')
      .values(userGroupToPg(userGroup))
      .execute();
  }

  private async _update(id: string, userGroup: UserGroup): Promise<void> {
    const data = diff(userGroup.pgState, userGroupToPg(userGroup));
    if (!data) {
      return;
    }

    await this.db.write
      //
      .updateTable('user_groups')
      .set(data)
      .where('id', '=', id)
      .execute();
  }

  private _getFilterQb(opts?: UserGroupFilterOptions) {
    const { filter, actor } = opts || {};

    return this.db.read
      .selectFrom('user_groups')
      .select('user_groups.id')
      .where(userGroupsTableFilter)
      .$if(isDefined(actor), (q) => addUserGroupActorFilter(q, actor!))
      .$if(isDefined(filter?.groupName), (q) =>
        q.where('user_groups.group_name', '=', filter!.groupName!),
      )
      .$if(!!filter?.userIds?.length, (q) =>
        q
          .innerJoin(
            'user_group_users',
            'user_group_users.user_group_id',
            'user_groups.id',
          )
          .innerJoin('users', 'users.id', 'user_group_users.user_id')
          .where('users.id', 'in', filter!.userIds!),
      )
      .$if(isDefined(filter?.search), (q) => {
        const search = `%${filter!.search!}%`;

        return q.where((eb) =>
          eb.or([
            //
            eb('user_groups.group_name', 'ilike', search),
            eb('user_groups.description', 'ilike', search),
          ]),
        );
      });
  }

  private _validate(_userGroup: UserGroup) {
    // validation rules can be added here
  }
}

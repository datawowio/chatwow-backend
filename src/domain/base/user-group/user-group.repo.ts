import { Injectable } from '@nestjs/common';
import { Except } from 'type-fest';

import { addPagination, queryCount, sortQb } from '@infra/db/db.util';

import { diff, getUniqueIds } from '@shared/common/common.func';
import { BaseRepo } from '@shared/common/common.repo';
import { isDefined } from '@shared/common/common.validator';

import { UserGroup } from './user-group.domain';
import { UserGroupMapper } from './user-group.mapper';
import { userGroupsTableFilter } from './user-group.utils';
import {
  UserGroupCountQueryOptions,
  UserGroupQueryOptions,
} from './user-group.zod';

@Injectable()
export class UserGroupRepo extends BaseRepo {
  async getIds(opts?: UserGroupQueryOptions) {
    opts ??= {};
    const { sort, pagination } = opts;

    const qb = await this._getFilterQb(opts)
      .select('user_groups.id')
      .$if(!!sort?.length, (q) =>
        sortQb(q, opts!.sort, {
          id: 'user_groups.id',
          createdAt: 'user_groups.created_at',
          groupName: 'user_groups.group_name',
        }),
      )
      .$call((q) => addPagination(q, pagination))
      .execute();

    return getUniqueIds(qb);
  }

  async getCount(opts?: UserGroupCountQueryOptions) {
    const totalCount = await this
      //
      ._getFilterQb({
        filter: opts?.filter,
      })
      .$call((q) => queryCount(q));

    return totalCount;
  }

  async create(userGroup: UserGroup): Promise<void> {
    await this.db
      //
      .insertInto('user_groups')
      .values(UserGroupMapper.toPg(userGroup))
      .execute();
  }

  async update(id: string, userGroup: UserGroup): Promise<void> {
    const data = diff(userGroup.pgState, UserGroupMapper.toPg(userGroup));
    if (!data) {
      return;
    }

    await this.db
      //
      .updateTable('user_groups')
      .set(data)
      .where('id', '=', id)
      .execute();
  }

  async findOne(id: string): Promise<UserGroup | null> {
    const userGroupPg = await this.readDb
      .selectFrom('user_groups')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();

    if (!userGroupPg) {
      return null;
    }

    const userGroup = UserGroupMapper.fromPgWithState(userGroupPg);
    return userGroup;
  }

  async delete(id: string): Promise<void> {
    await this.db
      //
      .deleteFrom('user_groups')
      .where('id', '=', id)
      .execute();
  }

  private _getFilterQb(opts?: Except<UserGroupQueryOptions, 'pagination'>) {
    const filter = opts?.filter;

    return this.readDb
      .selectFrom('user_groups')
      .select('user_groups.id')
      .where(userGroupsTableFilter)
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
}

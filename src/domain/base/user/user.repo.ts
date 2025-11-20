import { Injectable } from '@nestjs/common';
import { isDefined } from 'class-validator';
import { Except } from 'type-fest';

import { getErrorKey } from '@infra/db/db.common';
import { addPagination, queryCount, sortQb } from '@infra/db/db.util';

import { diff, getUniqueIds } from '@shared/common/common.func';
import { BaseRepo } from '@shared/common/common.repo';
import { ApiException } from '@shared/http/http.exception';

import { User } from './user.domain';
import { UserMapper } from './user.mapper';
import { usersTableFilter } from './user.util';
import { UserQueryOptions } from './user.zod';

@Injectable()
export class UserRepo extends BaseRepo {
  async getIds(opts?: UserQueryOptions) {
    opts ??= {};
    const { sort, pagination } = opts;

    const qb = await this._getFilterQb(opts)
      .select('users.id')
      .$if(!!sort?.length, (q) =>
        sortQb(q, opts!.sort, {
          id: 'users.id',
          createdAt: 'users.created_at',
          firstName: 'users.first_name',
          lastName: 'users.last_name',
          email: 'users.email',
          lastSignedInAt: 'users.last_signed_in_at',
        }),
      )
      .$call((q) => addPagination(q, pagination))
      .execute();

    return getUniqueIds(qb);
  }

  async getCount(opts?: UserQueryOptions) {
    const totalCount = await this
      //
      ._getFilterQb(opts)
      .$call((q) => queryCount(q));

    return totalCount;
  }

  async create(user: User): Promise<void> {
    await this._tryWrite(async () =>
      this.db
        //
        .insertInto('users')
        .values(UserMapper.toPg(user))
        .execute(),
    );
  }

  async update(id: string, user: User): Promise<void> {
    const data = diff(user.pgState, UserMapper.toPg(user));
    if (!data) {
      return;
    }

    await this._tryWrite(async () =>
      this.db
        //
        .updateTable('users')
        .set(data)
        .where('id', '=', id)
        .execute(),
    );
  }

  async findOne(id: string): Promise<User | null> {
    const userPg = await this.readDb
      .selectFrom('users')
      .selectAll()
      .where('id', '=', id)
      .where(usersTableFilter)
      .executeTakeFirst();

    if (!userPg) {
      return null;
    }

    const user = UserMapper.fromPgWithState(userPg);
    return user;
  }

  async delete(id: string): Promise<void> {
    await this.db
      //
      .deleteFrom('users')
      .where('id', '=', id)
      .execute();
  }

  private async _tryWrite<T>(cb: () => Promise<T>) {
    try {
      const data = await cb();
      return data;
    } catch (e: any) {
      const errKey = getErrorKey(e);
      if (errKey === 'exists') {
        throw new ApiException(409, 'emailExists');
      }

      throw new ApiException(500, 'internal');
    }
  }

  private _getFilterQb(opts?: Except<UserQueryOptions, 'pagination'>) {
    const filter = opts?.filter;

    return this.readDb
      .selectFrom('users')
      .select('users.id')
      .where(usersTableFilter)
      .$if(isDefined(filter?.firstName), (q) =>
        q.where('users.first_name', '=', filter!.firstName!),
      )
      .$if(isDefined(filter?.lastName), (q) =>
        q.where('users.last_name', '=', filter!.lastName!),
      )
      .$if(isDefined(filter?.role), (q) =>
        q.where('users.role', '=', filter!.role!),
      )
      .$if(isDefined(filter?.userStatus), (q) =>
        q.where('users.user_status', '=', filter!.userStatus!),
      )
      .$if(isDefined(filter?.email), (q) =>
        q.where('users.email', '=', filter!.email!),
      )
      .$if(!!filter?.userGroupIds?.length, (q) =>
        q
          .innerJoin('user_group_users', 'user_group_users.user_id', 'users.id')
          .where('user_group_users.user_group_id', 'in', filter!.userGroupIds!),
      )
      .$if(isDefined(filter?.search), (q) => {
        const search = `%${filter!.search!}%`;

        return q.where((eb) =>
          eb.or([
            //
            eb('users.first_name', 'ilike', search),
            eb('users.last_name', 'ilike', search),
            eb('users.email', 'ilike', search),
          ]),
        );
      });
  }
}

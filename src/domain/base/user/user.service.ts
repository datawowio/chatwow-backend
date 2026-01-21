import { Injectable } from '@nestjs/common';
import { Except } from 'type-fest';

import { getErrorKey } from '@infra/db/db.common';
import { MainDb } from '@infra/db/db.main';
import { addPagination, queryCount, sortQb } from '@infra/db/db.util';

import { diff, getUniqueIds } from '@shared/common/common.func';
import { isDefined } from '@shared/common/common.validator';
import { ApiException } from '@shared/http/http.exception';

import { User } from './user.domain';
import { userFromPgWithState, userToPg } from './user.mapper';
import { usersTableFilter } from './user.util';
import { UserCountQueryOptions, UserQueryOptions } from './user.zod';

@Injectable()
export class UserService {
  constructor(private db: MainDb) {}

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

  async getCount(opts?: UserCountQueryOptions) {
    const totalCount = await this
      //
      ._getFilterQb({
        filter: opts?.filter,
      })
      .$call((q) => queryCount(q));

    return totalCount;
  }

  async findOne(id: string) {
    const userPg = await this.db.read
      .selectFrom('users')
      .selectAll()
      .where('id', '=', id)
      .where(usersTableFilter)
      .limit(1)
      .executeTakeFirst();

    if (!userPg) {
      return null;
    }

    const user = userFromPgWithState(userPg);
    return user;
  }

  async findMany(ids: string[]) {
    const userPgs = await this.db.read
      .selectFrom('users')
      .selectAll()
      .where('id', 'in', ids)
      .where(usersTableFilter)
      .execute();

    return userPgs.map((u) => userFromPgWithState(u));
  }

  async save(user: User) {
    this._validate(user);

    if (!user.isPersist) {
      await this._create(user);
    } else {
      await this._update(user.id, user);
    }

    user.setPgState(userToPg);
  }

  async saveBulk(users: User[]) {
    return Promise.all(users.map((u) => this.save(u)));
  }

  async delete(id: string) {
    await this.db.write
      //
      .deleteFrom('users')
      .where('id', '=', id)
      .execute();
  }

  private _validate(_user: User) {
    // validation rules can be added here
  }

  private async _create(user: User) {
    await this._tryWrite(async () =>
      this.db.write
        //
        .insertInto('users')
        .values(userToPg(user))
        .execute(),
    );
  }

  private async _update(id: string, user: User) {
    const data = diff(user.pgState, userToPg(user));
    if (!data) {
      return;
    }

    await this._tryWrite(async () =>
      this.db.write
        //
        .updateTable('users')
        .set(data)
        .where('id', '=', id)
        .execute(),
    );
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

    return this.db.read
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
      .$if(!!filter?.roles?.length, (q) =>
        q.where('users.role', 'in', filter!.roles!),
      )
      .$if(isDefined(filter?.userStatus), (q) =>
        q.where('users.user_status', '=', filter!.userStatus!),
      )
      .$if(!!filter?.userStatuses?.length, (q) =>
        q.where('users.user_status', 'in', filter!.userStatuses!),
      )
      .$if(isDefined(filter?.email), (q) =>
        q.where('users.email', '=', filter!.email!),
      )
      .$if(!!filter?.userGroupIds?.length, (q) =>
        q
          .innerJoin('user_group_users', 'user_group_users.user_id', 'users.id')
          .where('user_group_users.user_group_id', 'in', filter!.userGroupIds!),
      )
      .$if(!!filter?.departmentIds?.length, (q) =>
        q.where('users.department_id', 'in', filter!.departmentIds!),
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

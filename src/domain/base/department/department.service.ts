import { Injectable } from '@nestjs/common';
import { Except } from 'type-fest';

import { getErrorKey } from '@infra/db/db.common';
import { MainDb } from '@infra/db/db.main';
import { addPagination, queryCount, sortQb } from '@infra/db/db.util';

import { diff, getUniqueIds } from '@shared/common/common.func';
import { isDefined } from '@shared/common/common.validator';
import { ApiException } from '@shared/http/http.exception';

import { Department } from './department.domain';
import { departmentFromPgWithState, departmentToPg } from './department.mapper';
import { departmentsTableFilter } from './department.util';
import {
  DepartmentCountQueryOptions,
  DepartmentQueryOptions,
} from './department.zod';

@Injectable()
export class DepartmentService {
  constructor(private db: MainDb) {}

  async getIds(opts?: DepartmentQueryOptions) {
    opts ??= {};
    const { sort, pagination } = opts;

    const qb = await this._getFilterQb(opts)
      .select('departments.id')
      .$if(!!sort?.length, (q) =>
        sortQb(q, opts!.sort, {
          id: 'departments.id',
          departmentName: 'departments.department_name',
          createdAt: 'departments.created_at',
          updatedAt: 'departments.updated_at',
        }),
      )
      .$call((q) => addPagination(q, pagination))
      .execute();

    return getUniqueIds(qb);
  }

  async getCount(opts?: DepartmentCountQueryOptions) {
    const totalCount = await this
      //
      ._getFilterQb({
        filter: opts?.filter,
      })
      .$call((q) => queryCount(q));

    return totalCount;
  }

  async findOne(id: string) {
    const departmentPg = await this.db.read
      .selectFrom('departments')
      .selectAll()
      .where('id', '=', id)
      .where(departmentsTableFilter)
      .limit(1)
      .executeTakeFirst();

    if (!departmentPg) {
      return null;
    }

    const department = departmentFromPgWithState(departmentPg);
    return department;
  }

  async findMany(ids: string[]) {
    const departmentPgs = await this.db.read
      .selectFrom('departments')
      .selectAll()
      .where('id', 'in', ids)
      .where(departmentsTableFilter)
      .execute();

    return departmentPgs.map((d) => departmentFromPgWithState(d));
  }

  async save(department: Department) {
    this._validate(department);

    if (!department.isPersist) {
      await this._create(department);
    } else {
      await this._update(department.id, department);
    }

    department.setPgState(departmentToPg);
  }

  async saveBulk(departments: Department[]) {
    return Promise.all(departments.map((d) => this.save(d)));
  }

  async delete(id: string) {
    await this.db.write
      //
      .deleteFrom('departments')
      .where('id', '=', id)
      .execute();
  }

  private _validate(_department: Department) {
    // validation rules can be added here
  }

  private async _create(department: Department) {
    await this._tryWrite(async () =>
      this.db.write
        //
        .insertInto('departments')
        .values(departmentToPg(department))
        .execute(),
    );
  }

  private async _update(id: string, department: Department) {
    const data = diff(department.pgState, departmentToPg(department));
    if (!data) {
      return;
    }

    await this._tryWrite(async () =>
      this.db.write
        //
        .updateTable('departments')
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
        throw new ApiException(409, 'departmentExists');
      }

      throw new ApiException(500, 'internal');
    }
  }

  private _getFilterQb(opts?: Except<DepartmentQueryOptions, 'pagination'>) {
    const filter = opts?.filter;

    return this.db.read
      .selectFrom('departments')
      .select('departments.id')
      .where(departmentsTableFilter)
      .$if(isDefined(filter?.departmentName), (q) =>
        q.where('departments.department_name', '=', filter!.departmentName!),
      )
      .$if(!!filter?.ids?.length, (q) =>
        q.where('departments.id', 'in', filter!.ids!),
      )
      .$if(isDefined(filter?.search), (q) => {
        const search = `%${filter!.search!}%`;

        return q.where((eb) =>
          eb.or([
            //
            eb('departments.department_name', 'ilike', search),
          ]),
        );
      });
  }
}

import { MainDb } from '@infra/db/db.main';

import { QueryInterface } from '@shared/common/common.type';
import { toHttpSuccess } from '@shared/http/http.mapper';

import { UserSummaryDto, UserSummaryResponse } from './user-summary.dto';

export class UserSummaryQuery implements QueryInterface {
  constructor(private db: MainDb) {}

  async exec(query: UserSummaryDto): Promise<UserSummaryResponse> {
    const data = await this.getRaw(query);

    return toHttpSuccess({
      data: {
        totalUsers: Number(data.totalUsers),
        activeUsers: data.activeUsers ? Number(data.activeUsers) : undefined,
        inactiveUsers: data.inactiveUsers
          ? Number(data.inactiveUsers)
          : undefined,
        pendingRegistrationUsers: data.pendingRegistrationUsers
          ? Number(data.pendingRegistrationUsers)
          : undefined,
        lineLinkedUsers: data.lineLinkedUsers
          ? Number(data.lineLinkedUsers)
          : undefined,
      },
    });
  }

  async getRaw(query: UserSummaryDto) {
    const data = await this.db.read
      .selectFrom('users')
      .select(({ fn }) => fn.count<string>('users.id').as('totalUsers'))
      .$if(query.includes.has('activeUsers'), (qb) =>
        qb.select(({ fn }) =>
          fn
            .count<string>('users.id')
            .filterWhere('users.user_status', '=', 'ACTIVE')
            .as('activeUsers'),
        ),
      )
      .$if(query.includes.has('inactiveUsers'), (qb) =>
        qb.select(({ fn }) =>
          fn
            .count<string>('users.id')
            .filterWhere('users.user_status', '=', 'INACTIVE')
            .as('inactiveUsers'),
        ),
      )
      .$if(query.includes.has('pendingRegistrationUsers'), (qb) =>
        qb.select(({ fn }) =>
          fn
            .count<string>('users.id')
            .filterWhere('users.user_status', '=', 'PENDING_REGISTRATION')
            .as('pendingRegistrationUsers'),
        ),
      )
      .$if(query.includes.has('lineLinkedUsers'), (qb) =>
        qb.select(({ fn }) =>
          fn
            .count<string>('users.id')
            .filterWhere('users.line_account_id', 'is not', null)
            .as('lineLinkedUsers'),
        ),
      )
      .executeTakeFirstOrThrow();

    return data;
  }
}

import type { EB, SelectAnyQB } from '@infra/db/db.common';
import { UserClaims } from '@infra/middleware/jwt/jwt.common';

export function userGroupsTableFilter(eb: EB<'user_groups'>) {
  // no base filter
  return eb.and([]);
}

export function addUserGroupActorFilter<T extends SelectAnyQB<'user_groups'>>(
  q: T,
  actor: UserClaims,
): T {
  if (actor.role !== 'MANAGER') {
    return q;
  }

  return q
    .leftJoin(
      'user_group_managers',
      'user_group_managers.user_group_id',
      'user_groups.id',
    )
    .where((eb) =>
      eb.or([
        eb('user_group_managers.user_id', '=', actor.userId),
        eb('user_groups.created_by_id', '=', actor.userId),
      ]),
    ) as T;
}

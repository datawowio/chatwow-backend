import type { EB, SelectAnyQB } from '@infra/db/db.common';
import { UserClaims } from '@infra/middleware/jwt/jwt.common';

export function projectsTableFilter(eb: EB<'projects'>) {
  // no base filter
  return eb.and([]);
}

export function addProjectManagerFilter<T extends SelectAnyQB<'projects'>>(
  q: T,
  actor: UserClaims,
): T {
  if (actor.role !== 'MANAGER') {
    return q;
  }

  return q
    .leftJoin(
      'user_manage_projects',
      'user_manage_projects.project_id',
      'projects.id',
    )
    .where((eb) =>
      eb.or([
        eb('user_manage_projects.user_id', '=', actor.userId),
        // eb('projects.created_by_id', '=', actor.userId),
      ]),
    ) as T;
}

export function addProjectActorFilter<T extends SelectAnyQB<'projects'>>(
  q: T,
  actor: UserClaims,
): T {
  if (actor.role === 'ADMIN') {
    return q;
  }

  return q
    .leftJoin(
      'user_group_projects',
      'user_group_projects.project_id',
      'projects.id',
    )
    .leftJoin(
      'user_group_users',
      'user_group_users.user_group_id',
      'user_group_projects.user_group_id',
    )
    .where((eb) =>
      eb.or([eb('user_group_users.user_id', '=', actor.userId)]),
    ) as T;
}

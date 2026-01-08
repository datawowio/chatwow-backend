import { Injectable } from '@nestjs/common';

import { MainDb } from '@infra/db/db.main';
import { addPagination, queryCount, sortQb } from '@infra/db/db.util';

import { diff, getUniqueIds } from '@shared/common/common.func';

import { AiUsageUserGroup } from './ai-usage-user-group.domain';
import {
  aiUsageUserGroupFromPgWithState,
  aiUsageUserGroupToPg,
} from './ai-usage-user-group.mapper';
import { aiUsageUserGroupsTableFilter } from './ai-usage-user-group.util';
import {
  AiUsageUserGroupFilterOptions,
  AiUsageUserGroupQueryOptions,
} from './ai-usage-user-group.zod';

@Injectable()
export class AiUsageUserGroupService {
  constructor(private db: MainDb) {}

  async getIds(opts?: AiUsageUserGroupQueryOptions) {
    const { sort, pagination, filter } = opts?.options || {};

    const qb = await this._getFilterQb({
      filter,
      actor: opts?.actor,
    })
      .select('ai_usage_user_groups.id')
      .$if(!!sort?.length, (q) =>
        sortQb(q, sort, {
          id: 'ai_usage_user_groups.id',
          createdAt: 'ai_usage_user_groups.created_at',
          tokenUsed: 'ai_usage_user_groups.token_used',
          chatCount: 'ai_usage_user_groups.chat_count',
        }),
      )
      .$call((q) => addPagination(q, pagination))
      .execute();

    return getUniqueIds(qb);
  }

  async getCount(opts?: AiUsageUserGroupFilterOptions) {
    const totalCount = await this
      //
      ._getFilterQb(opts)
      .$call((q) => queryCount(q));

    return totalCount;
  }

  async findOne(id: string): Promise<AiUsageUserGroup | null> {
    const aiUsageUserGroupPg = await this.db.read
      .selectFrom('ai_usage_user_groups')
      .selectAll('ai_usage_user_groups')
      .where('id', '=', id)
      .limit(1)
      .executeTakeFirst();

    if (!aiUsageUserGroupPg) {
      return null;
    }

    const aiUsageUserGroup =
      aiUsageUserGroupFromPgWithState(aiUsageUserGroupPg);
    return aiUsageUserGroup;
  }

  async save(aiUsageUserGroup: AiUsageUserGroup) {
    this._validate(aiUsageUserGroup);

    if (!aiUsageUserGroup.isPersist) {
      await this._create(aiUsageUserGroup);
    } else {
      await this._update(aiUsageUserGroup.id, aiUsageUserGroup);
    }

    aiUsageUserGroup.setPgState(aiUsageUserGroupToPg);
  }

  async saveBulk(aiUsageUserGroups: AiUsageUserGroup[]) {
    return Promise.all(aiUsageUserGroups.map((p) => this.save(p)));
  }

  async delete(id: string) {
    await this.db.write
      //
      .deleteFrom('ai_usage_user_groups')
      .where('id', '=', id)
      .execute();
  }

  async deleteBulk(ids: string[]) {
    await Promise.all(ids.map((id) => this.delete(id)));
  }

  private async _create(aiUsageUserGroup: AiUsageUserGroup): Promise<void> {
    await this.db.write
      //
      .insertInto('ai_usage_user_groups')
      .values(aiUsageUserGroupToPg(aiUsageUserGroup))
      .execute();
  }

  private async _update(
    id: string,
    aiUsageUserGroup: AiUsageUserGroup,
  ): Promise<void> {
    const data = diff(
      aiUsageUserGroup.pgState,
      aiUsageUserGroupToPg(aiUsageUserGroup),
    );
    if (!data) {
      return;
    }

    await this.db.write
      //
      .updateTable('ai_usage_user_groups')
      .set(data)
      .where('id', '=', id)
      .execute();
  }

  private _getFilterQb(opts?: AiUsageUserGroupFilterOptions) {
    const { filter } = opts || {};

    return this.db.read
      .selectFrom('ai_usage_user_groups')
      .where(aiUsageUserGroupsTableFilter)
      .$if(!!filter?.aiUsageIds?.length, (qb) =>
        qb.where('ai_usage_user_groups.ai_usage_id', 'in', filter!.aiUsageIds!),
      )
      .$if(!!filter?.userGroupIds?.length, (qb) =>
        qb.where(
          'ai_usage_user_groups.user_group_id',
          'in',
          filter!.userGroupIds!,
        ),
      );
  }

  private _validate(_aiUsageUserGroup: AiUsageUserGroup) {
    // validation rules can be added here
  }
}

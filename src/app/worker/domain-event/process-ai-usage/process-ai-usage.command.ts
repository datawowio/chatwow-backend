import { AiUsageUserGroup } from '@domain/base/ai-usage-user-group/ai-usage-user-group.domain';
import { newAiUsageUserGroup } from '@domain/base/ai-usage-user-group/ai-usage-user-group.factory';
import { AiUsageUserGroupService } from '@domain/base/ai-usage-user-group/ai-usage-user-group.service';
import { AiUsage } from '@domain/base/ai-usage/ai-usage.domain';
import { AiUsageService } from '@domain/base/ai-usage/ai-usage.service';
import { Injectable } from '@nestjs/common';
import { match } from 'ts-pattern';

import { MainDb } from '@infra/db/db.main';
import { TransactionService } from '@infra/db/transaction/transaction.service';

import { newBig } from '@shared/common/common.func';

import { ProcessAiUsageJobData } from './process-ai-usage.type';

type Entity = {
  aiUsage: AiUsage;
  aiUsageUserGroups: AiUsageUserGroup[];
};

@Injectable()
export class ProcessAiUsageCommand {
  constructor(
    private aiUsageService: AiUsageService,
    private aiUsageUserGroupService: AiUsageUserGroupService,
    private transactionService: TransactionService,
    private db: MainDb,
  ) {}

  async exec(data: ProcessAiUsageJobData) {
    const entity = await match(data.owner)
      .with('project', () => this.processProject(data.aiUsage))
      .with('userGroup', () => this.processUserGroup(data.aiUsage))
      .exhaustive();

    await this.save(entity);
  }

  async save({ aiUsage, aiUsageUserGroups }: Entity) {
    await this.transactionService.transaction(async () => {
      await this.aiUsageService.save(aiUsage);
      await this.aiUsageUserGroupService.saveBulk(aiUsageUserGroups);
    });
  }

  async processProject(aiUsage: AiUsage): Promise<Entity> {
    return {
      aiUsage,
      aiUsageUserGroups: [],
    };
  }

  async processUserGroup(aiUsage: AiUsage): Promise<Entity> {
    const res = await this.db.read
      .selectFrom('user_group_users')
      .select('user_group_id as userGroupId')
      .distinct()
      .where('user_id', '=', aiUsage.createdById)
      .execute();

    const groupLength = res.length;

    return {
      aiUsage,
      aiUsageUserGroups: res.map((r) =>
        newAiUsageUserGroup({
          aiUsageId: aiUsage.id,
          chatCount: newBig(1).div(groupLength),
          tokenUsed: aiUsage.tokenUsed.div(groupLength),
          tokenPrice: aiUsage.tokenPrice.div(groupLength),
          userGroupId: r.userGroupId,
        }),
      ),
    };
  }
}

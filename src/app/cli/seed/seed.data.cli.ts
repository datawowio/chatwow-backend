import { mockAiUsageUserGroup } from '@domain/base/ai-usage-user-group/ai-usage-user-group.factory';
import { AiUsageUserGroupService } from '@domain/base/ai-usage-user-group/ai-usage-user-group.service';
import { mockAiUsages } from '@domain/base/ai-usage/ai-usage.factory';
import { AiUsageService } from '@domain/base/ai-usage/ai-usage.service';
import { mockProjects } from '@domain/base/project/project.factory';
import { ProjectService } from '@domain/base/project/project.service';
import { UserGroupProjectService } from '@domain/base/user-group-project/user-group-project.service';
import { UserGroupUserService } from '@domain/base/user-group-user/user-group-user.service';
import { mockUserGroups } from '@domain/base/user-group/user-group.factory';
import { UserGroupService } from '@domain/base/user-group/user-group.service';
import { mockUsers } from '@domain/base/user/user.factory';
import { UserService } from '@domain/base/user/user.service';
import { faker } from '@faker-js/faker';
import { Command, CommandRunner } from 'nest-commander';

import { TransactionService } from '@infra/db/transaction/transaction.service';

import { SUPERADMIN_UUID } from '@shared/common/common.constant';
import { getRandomId } from '@shared/common/common.func';

@Command({
  name: 'seed:data',
  description: 'populate user record',
})
export class SeedDataCli extends CommandRunner {
  constructor(
    private userService: UserService,
    private transactionService: TransactionService,
    private userGroupService: UserGroupService,
    private projectService: ProjectService,
    private userGroupUserService: UserGroupUserService,
    private userGroupProjectService: UserGroupProjectService,
    private aiUsageService: AiUsageService,
    private aiUsageUserGroupService: AiUsageUserGroupService,
  ) {
    super();
  }

  async run(_passedParams: string[]): Promise<void> {
    try {
      await this.transactionService.transaction(async () => this._initAll());
    } catch (error) {
      console.log('==================================');
      console.log(error);
      console.log('==================================');
    }
  }

  private async _initAll(): Promise<void> {
    const amountEach = 10;
    const superAdminId = SUPERADMIN_UUID;

    // temp mock
    const sampleUsers = mockUsers(amountEach, {
      createdById: superAdminId,
      role: 'USER',
    });
    const sampleProjects = mockProjects(amountEach, {
      createdById: superAdminId,
    });
    const sampleUserGroups = mockUserGroups(amountEach, {
      createdById: superAdminId,
    });

    await this.userService.saveBulk(sampleUsers);
    await this.projectService.saveBulk(sampleProjects, { disableEvent: true });
    await this.userGroupService.saveBulk(sampleUserGroups);

    const relationAmount = Math.floor(amountEach / 4);
    const process: Promise<any>[] = [];

    sampleUserGroups.forEach((group) => {
      const randomUsers = faker.helpers.arrayElements(
        sampleUsers,
        relationAmount,
      );

      const randomProjects = faker.helpers.arrayElements(
        sampleProjects,
        relationAmount,
      );

      const prom1 = this.userGroupProjectService.saveUserGroupRelations(
        group.id,
        randomProjects.map((p) => p.id),
      );

      const prom2 = this.userGroupUserService.saveUserGroupRelations(
        group.id,
        randomUsers.map((u) => u.id),
      );

      randomProjects.forEach((project) => {
        const aiUsages = mockAiUsages(relationAmount, {
          projectId: project.id,
          createdById: getRandomId(randomUsers),
        });

        const aiUsageUserGroups = aiUsages.map((aiUsage) =>
          mockAiUsageUserGroup({
            aiUsageId: aiUsage.id,
            userGroupId: group.id,
          }),
        );

        const prom1 = this.aiUsageService.saveBulk(aiUsages);
        const prom2 = this.aiUsageUserGroupService.saveBulk(aiUsageUserGroups);

        process.push(prom1);
        process.push(prom2);
      });

      process.push(prom1);
      process.push(prom2);
    });

    await Promise.all(process);
  }
}

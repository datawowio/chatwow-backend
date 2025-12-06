import { newProjectChat } from '@domain/base/project-chat/project-chat.factory';
import { ProjectChatService } from '@domain/base/project-chat/project-chat.service';
import { newProjectDocument } from '@domain/base/project-document/project-document.factory';
import { ProjectDocumentService } from '@domain/base/project-document/project-document.service';
import { mockProjects, newProject } from '@domain/base/project/project.factory';
import { ProjectService } from '@domain/base/project/project.service';
import { UserGroupManagerService } from '@domain/base/user-group-manager/user-group-manager.service';
import { UserGroupProjectService } from '@domain/base/user-group-project/user-group-project.service';
import { UserGroupUserService } from '@domain/base/user-group-user/user-group-user.service';
import {
  mockUserGroups,
  newUserGroup,
} from '@domain/base/user-group/user-group.factory';
import { UserGroupService } from '@domain/base/user-group/user-group.service';
import { UserManageProjectService } from '@domain/base/user-manage-project/user-manage-project.service';
import { newUserVerification } from '@domain/base/user-verification/user-verification.factory';
import { UserVerificationService } from '@domain/base/user-verification/user-verification.service';
import { mockUsers, newUser } from '@domain/base/user/user.factory';
import { UserService } from '@domain/base/user/user.service';
import { Command, CommandRunner } from 'nest-commander';

import { TransactionService } from '@infra/db/transaction/transaction.service';

import { getRandomIds } from '@shared/common/common.func';

@Command({
  name: 'initials:seed',
  description: 'Create record in initials table',
})
export class InitialsCliSeed extends CommandRunner {
  constructor(
    private userService: UserService,
    private transactionService: TransactionService,
    private userGroupService: UserGroupService,
    private projectService: ProjectService,
    private projectChatService: ProjectChatService,
    private projectDocumentService: ProjectDocumentService,
    private userGroupUserService: UserGroupUserService,
    private userGroupProjectService: UserGroupProjectService,
    private userManageProjectService: UserManageProjectService,
    private userVerificationService: UserVerificationService,
    private userGroupManagerService: UserGroupManagerService,
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
    const superAdmin = newUser({
      actorId: null,
      data: {
        email: 'superadmin@example.com',
        password: 'password',
        role: 'ADMIN',
        firstName: 'superadmin',
        lastName: 'superadmin',
        userStatus: 'ACTIVE',
      },
    });
    const superAdminVerification = newUserVerification({
      userId: superAdmin.id,
    });

    const groupA = newUserGroup({
      actorId: superAdmin.id,
      data: {
        groupName: 'test group',
        description: 'for local test',
      },
    });

    const projectA = newProject({
      actorId: superAdmin.id,
      data: {
        projectName: 'local test',
        projectStatus: 'ACTIVE',
        projectDescription: 'for local testing',
      },
    });
    const projectChatA = newProjectChat({
      chatSender: 'USER',
      message: 'hello',
      projectId: projectA.id,
      userId: superAdmin.id,
    });
    const projectChatB = newProjectChat({
      chatSender: 'BOT',
      message: 'hello this is a project chat',
      projectId: projectA.id,
      userId: superAdmin.id,
      parentId: projectChatA.id,
    });
    const projectDocumentA = newProjectDocument({
      actorId: superAdmin.id,
      data: {
        projectId: projectA.id,
        documentStatus: 'ACTIVE',
        aiSummaryMd: 'this is summary for docA',
        documentDetails: 'This is the details of document A',
      },
    });
    const projectDocumentB = newProjectDocument({
      actorId: superAdmin.id,
      data: {
        projectId: projectA.id,
        documentStatus: 'ACTIVE',
        aiSummaryMd: 'this is summary for doc B',
        documentDetails: 'This is the details of document B',
      },
    });

    // save db
    await this.userService.save(superAdmin);
    await this.userVerificationService.save(superAdminVerification);
    await this.userGroupService.save(groupA);
    await this.projectService.save(projectA);
    await this.userGroupUserService.saveUserRelations(superAdmin.id, [
      groupA.id,
    ]);
    await this.userGroupProjectService.saveUserGroupRelations(groupA.id, [
      projectA.id,
    ]);
    await this.userManageProjectService.saveUserRelations(superAdmin.id, [
      projectA.id,
    ]);
    await this.projectChatService.saveBulk([projectChatA, projectChatB]);
    await this.projectDocumentService.saveBulk([
      projectDocumentA,
      projectDocumentB,
    ]);

    await this.mockRandom(superAdmin.id);
  }

  async mockRandom(superAdminId: string, amountEach = 20) {
    // temp mock
    const sampleUsers = mockUsers(amountEach, {
      createdById: superAdminId,
    });
    const sampleProjects = mockProjects(amountEach, {
      createdById: superAdminId,
    });
    const sampleUserGroups = mockUserGroups(amountEach, {
      createdById: superAdminId,
    });

    await this.userService.saveBulk(sampleUsers);
    await this.projectService.saveBulk(sampleProjects);
    await this.userGroupService.saveBulk(sampleUserGroups);

    const relationAmount = Math.floor(amountEach / 4);
    const process: Promise<any>[] = [];
    sampleProjects.forEach(async (project) => {
      const prom = this.userManageProjectService.saveProjectRelations(
        project.id,
        getRandomIds(relationAmount, sampleUsers),
      );

      process.push(prom);

      const prom2 = this.userGroupProjectService.saveProjectRelations(
        project.id,
        getRandomIds(relationAmount, sampleUserGroups),
      );

      process.push(prom2);
    });

    sampleUserGroups.forEach((group) => {
      const prom = this.userGroupUserService.saveUserGroupRelations(
        group.id,
        getRandomIds(relationAmount, sampleUsers),
      );

      process.push(prom);

      const prom2 = this.userGroupManagerService.saveUserGroupRelations(
        group.id,
        getRandomIds(Math.floor(relationAmount / 2), sampleUsers),
      );

      process.push(prom2);
    });

    await Promise.all(process);
  }
}

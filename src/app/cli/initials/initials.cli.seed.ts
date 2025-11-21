import { LineAccount } from '@domain/base/line-account/line-account.domain';
import { LineAccountService } from '@domain/base/line-account/line-account.service';
import { ProjectChat } from '@domain/base/project-chat/project-chat.domain';
import { ProjectChatService } from '@domain/base/project-chat/project-chat.service';
import { ProjectDocument } from '@domain/base/project-document/project-document.domain';
import { ProjectDocumentService } from '@domain/base/project-document/project-document.service';
import { Project } from '@domain/base/project/project.domain';
import { ProjectService } from '@domain/base/project/project.service';
import { UserGroupProjectService } from '@domain/base/user-group-project/user-group-project.service';
import { UserGroupUserService } from '@domain/base/user-group-user/user-group-user.service';
import { UserGroup } from '@domain/base/user-group/user-group.domain';
import { UserGroupService } from '@domain/base/user-group/user-group.service';
import { UserManageProjectService } from '@domain/base/user-manage-project/user-manage-project.service';
import { User } from '@domain/base/user/user.domain';
import { UserService } from '@domain/base/user/user.service';
import { Command, CommandRunner } from 'nest-commander';

import { TransactionService } from '@infra/global/transaction/transaction.service';

@Command({
  name: 'initials:seed',
  description: 'Create record in initials table',
})
export class InitialsCliSeed extends CommandRunner {
  constructor(
    private userService: UserService,
    private lineAccountService: LineAccountService,
    private transactionService: TransactionService,
    private userGroupService: UserGroupService,
    private projectService: ProjectService,
    private projectChatService: ProjectChatService,
    private projectDocumentService: ProjectDocumentService,
    private userGroupUserService: UserGroupUserService,
    private userGroupProjectService: UserGroupProjectService,
    private userManageProjectService: UserManageProjectService,
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
    const superAdminLine = LineAccount.new({
      id: 'SUPERADMIN_LINE',
    });
    const superAdmin = User.new({
      actorId: null,
      data: {
        email: 'superadmin@example.com',
        password: 'password',
        role: 'ADMIN',
        firstName: 'superadmin',
        lastName: 'superadmin',
        userStatus: 'ACTIVE',
        lineAccountId: superAdminLine.id,
      },
    });

    const groupA = UserGroup.new({
      actorId: superAdmin.id,
      data: {
        groupName: 'test group',
        description: 'for local test',
      },
    });

    const projectA = Project.new({
      actorId: superAdmin.id,
      data: {
        projectName: 'local test',
        projectStatus: 'ACTIVE',
        projectDescription: 'for local testing',
      },
    });
    const projectChatA = ProjectChat.new({
      chatSender: 'USER',
      message: 'hello',
      projectId: projectA.id,
      userId: superAdmin.id,
    });
    const projectChatB = ProjectChat.new({
      chatSender: 'BOT',
      message: 'hello this is a project chat',
      projectId: projectA.id,
      userId: superAdmin.id,
      parentId: projectChatA.id,
    });
    const projectDocumentA = ProjectDocument.new({
      actorId: superAdmin.id,
      data: {
        projectId: projectA.id,
        documentStatus: 'ACTIVE',
        aiSummaryMd: 'this is summary for docA',
        documentDetails: 'This is the details of document A',
      },
    });
    const projectDocumentB = ProjectDocument.new({
      actorId: superAdmin.id,
      data: {
        projectId: projectA.id,
        documentStatus: 'ACTIVE',
        aiSummaryMd: 'this is summary for doc B',
        documentDetails: 'This is the details of document B',
      },
    });

    // save db
    await this.lineAccountService.save(superAdminLine);
    await this.userService.save(superAdmin);
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
  }
}

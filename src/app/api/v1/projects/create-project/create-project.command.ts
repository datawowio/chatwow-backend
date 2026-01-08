import { ProjectDocument } from '@domain/base/project-document/project-document.domain';
import { newProjectDocument } from '@domain/base/project-document/project-document.factory';
import { projectDocumentToResponse } from '@domain/base/project-document/project-document.mapper';
import { ProjectDocumentService } from '@domain/base/project-document/project-document.service';
import { Project } from '@domain/base/project/project.domain';
import { newProject } from '@domain/base/project/project.factory';
import { projectToResponse } from '@domain/base/project/project.mapper';
import { ProjectService } from '@domain/base/project/project.service';
import { STORED_FILE_OWNER_TABLE } from '@domain/base/stored-file/stored-file.constant';
import { StoredFile } from '@domain/base/stored-file/stored-file.domain';
import { newStoredFile } from '@domain/base/stored-file/stored-file.factory';
import { storedFileToResponse } from '@domain/base/stored-file/stored-file.mapper';
import { StoredFileService } from '@domain/base/stored-file/stored-file.service';
import { UserGroupProjectService } from '@domain/base/user-group-project/user-group-project.service';
import { UserGroup } from '@domain/base/user-group/user-group.domain';
import {
  userGroupFromPgWithState,
  userGroupToResponse,
} from '@domain/base/user-group/user-group.mapper';
import { userGroupsTableFilter } from '@domain/base/user-group/user-group.utils';
import { UserManageProjectService } from '@domain/base/user-manage-project/user-manage-project.service';
import { User } from '@domain/base/user/user.domain';
import { userToResponse } from '@domain/base/user/user.mapper';
import { UserService } from '@domain/base/user/user.service';
import { AiFileService } from '@domain/logic/ai-file/ai-file.service';
import { QueueDispatchService } from '@domain/logic/queue-dispatch/queue-dispatch.service';
import { Injectable } from '@nestjs/common';

import { MainDb } from '@infra/db/db.main';
import { TransactionService } from '@infra/db/transaction/transaction.service';
import { UserClaims } from '@infra/middleware/jwt/jwt.common';

import { CommandInterface } from '@shared/common/common.type';
import { ApiException } from '@shared/http/http.exception';
import { toHttpSuccess } from '@shared/http/http.mapper';

import { CreateProjectDto, CreateProjectResponse } from './create-project.dto';

type Entity = {
  project: Project;
  userGroups: UserGroup[];
  manageUsers: User[];
  projectDocumentsFiles: {
    storedFile: StoredFile;
    projectDocument: ProjectDocument;
  }[];
};

@Injectable()
export class CreateProjectCommand implements CommandInterface {
  constructor(
    private db: MainDb,

    private projectService: ProjectService,
    private storedFileService: StoredFileService,
    private userService: UserService,
    private userManageProjectService: UserManageProjectService,
    private projectDocumentService: ProjectDocumentService,
    private userGroupProjectService: UserGroupProjectService,
    private transactionService: TransactionService,
    private aiFileService: AiFileService,
    private queueDispatchService: QueueDispatchService,
  ) {}

  async exec(
    claims: UserClaims,
    body: CreateProjectDto,
  ): Promise<CreateProjectResponse> {
    const project = newProject({
      actorId: claims.userId,
      data: {
        ...body.project,
        projectStatus: 'ACTIVE',
      },
    });
    const userGroups = await this.getUserGroups(body.userGroupIds);
    const manageUsers = await this.getMangeUsers(body.manageUserIds);

    const projectDocumentsFiles: Entity['projectDocumentsFiles'] = [];

    if (body.projectDocuments) {
      for (const pd of body.projectDocuments) {
        const projectDocument = newProjectDocument({
          actorId: claims.userId,
          data: {
            projectId: project.id,
            documentStatus: 'ACTIVE',
            documentDetails: pd.documentDetails,
          },
        });
        const storedFile = newStoredFile({
          ...pd.storedFile,
          ownerTable: STORED_FILE_OWNER_TABLE.PROJECT_DOCUMENT,
          ownerId: projectDocument.id,
        });

        projectDocumentsFiles.push({
          projectDocument,
          storedFile,
        });
      }
    }

    await this.save({
      project,
      userGroups,
      projectDocumentsFiles,
      manageUsers,
    });

    return toHttpSuccess({
      data: {
        project: {
          attributes: projectToResponse(project),
          relations: {
            manageUsers: manageUsers.map((u) => ({
              attributes: userToResponse(u),
            })),
            userGroups: userGroups.map((g) => ({
              attributes: userGroupToResponse(g),
            })),
            projectDocuments: projectDocumentsFiles.map((pd) => ({
              attributes: projectDocumentToResponse(pd.projectDocument),
              relations: {
                storedFile: {
                  attributes: storedFileToResponse(pd.storedFile),
                },
              },
            })),
          },
        },
      },
    });
  }

  async save(entity: Entity): Promise<void> {
    await this.transactionService.transaction(async () => {
      await this.projectService.save(entity.project);

      if (entity.userGroups.length) {
        await this.userGroupProjectService.saveProjectRelations(
          entity.project.id,
          entity.userGroups.map((g) => g.id),
        );
      }

      if (entity.manageUsers.length) {
        await this.userManageProjectService.saveProjectRelations(
          entity.project.id,
          entity.manageUsers.map((u) => u.id),
        );
      }

      if (entity.projectDocumentsFiles.length) {
        await Promise.all(
          entity.projectDocumentsFiles.map(
            async ({ projectDocument, storedFile }) => {
              await this.storedFileService.save(storedFile);
              await this.aiFileService.writeProjectDocumentRawFile(
                projectDocument,
                storedFile,
              );

              await this.projectDocumentService.save(projectDocument);
              this.queueDispatchService.projectDocumentMdGenerate(
                projectDocument,
              );
            },
          ),
        );

        // if have file generate summary also
        this.queueDispatchService.projectMdGenerate(entity.project);
      }
    });
  }

  async getUserGroups(
    userGroupIds: string[] | undefined,
  ): Promise<UserGroup[]> {
    if (!userGroupIds?.length) {
      return [];
    }

    const rawRes = await this.db.read
      .selectFrom('user_groups')
      .where('id', 'in', userGroupIds)
      .where(userGroupsTableFilter)
      .selectAll()
      .execute();

    if (rawRes.length !== userGroupIds.length) {
      throw new ApiException(400, 'userGroupsNotFound');
    }

    return rawRes.map((r) => userGroupFromPgWithState(r));
  }

  async getMangeUsers(manageUserIds: string[] | undefined): Promise<User[]> {
    if (!manageUserIds?.length) {
      return [];
    }

    const manageUsers = await this.userService.findMany(manageUserIds);
    if (manageUsers.length !== manageUserIds.length) {
      throw new ApiException(400, 'usersNotFound');
    }

    return manageUsers;
  }
}

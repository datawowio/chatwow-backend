import { projectDocumentPgToResponse } from '@domain/base/project-document/project-document.mapper';
import { projectPgToResponse } from '@domain/base/project/project.mapper';
import {
  addProjectActorFilter,
  projectsTableFilter,
} from '@domain/base/project/project.util';
import { storedFilePgToResponse } from '@domain/base/stored-file/stored-file.mapper';
import { userGroupPgToResponse } from '@domain/base/user-group/user-group.mapper';
import { userPgToResponse } from '@domain/base/user/user.mapper';
import { Injectable } from '@nestjs/common';

import { MainDb } from '@infra/db/db.main';
import { UserClaims } from '@infra/middleware/jwt/jwt.common';

import { QueryInterface } from '@shared/common/common.type';
import { ApiException } from '@shared/http/http.exception';

import { projectsV1InclusionQb } from '../projects.v1.util';
import { GetProjectDto, GetProjectResponse } from './get-project.dto';

@Injectable()
export class GetProjectQuery implements QueryInterface {
  constructor(private db: MainDb) {}

  async exec(
    claims: UserClaims,
    id: string,
    query: GetProjectDto,
  ): Promise<GetProjectResponse> {
    const project = await this.getRaw(claims, id, query);

    return {
      success: true,
      key: '',
      data: {
        project: {
          attributes: projectPgToResponse(project),
          relations: {
            manageUsers:
              project.manageUsers &&
              project.manageUsers.map((user) => ({
                attributes: userPgToResponse(user),
              })),
            projectDocuments:
              project.projectDocuments &&
              project.projectDocuments.map((doc) => ({
                attributes: projectDocumentPgToResponse(doc),
                relations: {
                  createdBy: doc.createdBy
                    ? {
                        attributes: userPgToResponse(doc.createdBy),
                      }
                    : undefined,
                  updatedBy: doc.updatedBy
                    ? {
                        attributes: userPgToResponse(doc.updatedBy),
                      }
                    : undefined,
                  storedFile: doc.storedFile
                    ? {
                        attributes: storedFilePgToResponse(doc.storedFile),
                      }
                    : undefined,
                },
              })),
            userGroups:
              project.userGroups &&
              project.userGroups.map((group) => ({
                attributes: userGroupPgToResponse(group),
              })),
            createdBy: project.createdBy
              ? {
                  attributes: userPgToResponse(project.createdBy),
                }
              : undefined,
            updatedBy: project.updatedBy
              ? {
                  attributes: userPgToResponse(project.updatedBy),
                }
              : undefined,
          },
        },
      },
    };
  }

  async getRaw(actor: UserClaims, id: string, query: GetProjectDto) {
    const result = await this.db.read
      .selectFrom('projects')
      .$call((q) => projectsV1InclusionQb(q, query.includes, actor))
      .selectAll('projects')
      .where(projectsTableFilter)
      .where('projects.id', '=', id)
      .$call((q) => addProjectActorFilter(q, actor))
      .limit(1)
      .executeTakeFirst();

    if (!result) {
      throw new ApiException(404, 'projectNotFound');
    }

    return result;
  }
}

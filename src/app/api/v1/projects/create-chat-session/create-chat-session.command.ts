import { ProjectChatSession } from '@domain/base/project-chat-session/project-chat-session.domain';
import { newProjectChatSession } from '@domain/base/project-chat-session/project-chat-session.factory';
import { projectChatSessionToResponse } from '@domain/base/project-chat-session/project-chat-session.mapper';
import { ProjectChatSessionService } from '@domain/base/project-chat-session/project-chat-session.service';
import { Project } from '@domain/base/project/project.domain';
import { projectToResponse } from '@domain/base/project/project.mapper';
import { ProjectService } from '@domain/base/project/project.service';
import { Injectable } from '@nestjs/common';

import { TransactionService } from '@infra/db/transaction/transaction.service';
import { IdempotentContext } from '@infra/middleware/idempotent/idempotent.common';
import { UserClaims } from '@infra/middleware/jwt/jwt.common';

import { CommandInterface } from '@shared/common/common.type';
import { ApiException } from '@shared/http/http.exception';
import { toHttpSuccess } from '@shared/http/http.mapper';

import { CreateChatSessionResponse } from './create-chat-session.dto';

type Entity = {
  project: Project;
  projectChatSession: ProjectChatSession;
};

@Injectable()
export class CreateChatSessionCommand implements CommandInterface {
  constructor(
    private projectService: ProjectService,
    private projectChatSessionService: ProjectChatSessionService,
    private transactionService: TransactionService,
  ) {}

  async exec(
    idemCtx: IdempotentContext,
    claims: UserClaims,
    projectId: string,
  ): Promise<CreateChatSessionResponse> {
    const entity = await this.find(claims, projectId);

    if (!idemCtx.isDuplicateRequest) {
      await this.save(entity);
    }

    return toHttpSuccess({
      data: {
        projectChatSession: {
          attributes: projectChatSessionToResponse(entity.projectChatSession),
          relations: {
            project: {
              attributes: projectToResponse(entity.project),
            },
          },
        },
      },
    });
  }

  async save({ project, projectChatSession }: Entity): Promise<void> {
    await this.transactionService.transaction(async () => {
      await this.projectService.save(project);
      await this.projectChatSessionService.save(projectChatSession);
    });
  }

  async find(claims: UserClaims, projectId: string): Promise<Entity> {
    const project = await this.projectService.findOne(projectId, claims);
    if (!project) {
      throw new ApiException(404, 'projectNotFound');
    }

    return {
      project,
      projectChatSession: newProjectChatSession({
        projectId: project.id,
        userId: claims.userId,
      }),
    };
  }
}

import { ProjectDocument } from '@domain/base/project-document/project-document.domain';
import { projectDocumentToResponse } from '@domain/base/project-document/project-document.mapper';
import { ProjectDocumentService } from '@domain/base/project-document/project-document.service';
import { AiEventQueue } from '@domain/queue/ai-event/ai-event.queue';
import { Injectable } from '@nestjs/common';

import { UserClaims } from '@infra/middleware/jwt/jwt.common';

import { CommandInterface } from '@shared/common/common.type';
import { ApiException } from '@shared/http/http.exception';
import { toHttpSuccess } from '@shared/http/http.mapper';

import { RegenerateProjectDocumentSummaryResponse } from './regenerate-project-document-summary.dto';

@Injectable()
export class RegenerateProjectDocumentSummaryCommand
  implements CommandInterface
{
  constructor(
    private projectDocumentService: ProjectDocumentService,
    private aiEventQueue: AiEventQueue,
  ) {}

  async exec(
    claims: UserClaims,
    id: string,
  ): Promise<RegenerateProjectDocumentSummaryResponse> {
    const projectDocument = await this.find(claims, id);
    projectDocument.edit({
      data: {
        documentStatus: 'PROCESSING',
      },
    });

    await this.save(projectDocument);

    return toHttpSuccess({
      data: {
        projectDocument: {
          attributes: projectDocumentToResponse(projectDocument),
        },
      },
    });
  }

  async find(claims: UserClaims, id: string): Promise<ProjectDocument> {
    const projectDocument = await this.projectDocumentService.findOne(
      id,
      claims,
    );

    if (!projectDocument) {
      throw new ApiException(404, 'projectDocumentNotFound');
    }

    return projectDocument;
  }

  async save(projectDocument: ProjectDocument) {
    await this.projectDocumentService.save(projectDocument);
    this.aiEventQueue.jobProjectDocumentMdGenerate(projectDocument);
  }
}

import { ProjectDocument } from '@domain/base/project-document/project-document.domain';
import { Project } from '@domain/base/project/project.domain';
import { Injectable } from '@nestjs/common';

import { BaseAmqpExchange } from '@infra/global/amqp/amqp.abstract';

import { AI_EVENT_QUEUES, MQ_EXCHANGE } from '@app/worker/worker.constant';

import { uuidV7 } from '@shared/common/common.crypto';

import {
  ProjectDocumentMdGenerateJobInput,
  ProjectMdGenerateJobInput,
} from './ai-event.type';

@Injectable()
export class AiEventQueue extends BaseAmqpExchange {
  config = MQ_EXCHANGE.AI_EVENT;

  jobProjectMdGenerate(project: Project, aiUsageId: string) {
    const input: ProjectMdGenerateJobInput = {
      meta: {
        id: uuidV7(),
        ai_usage_id: aiUsageId,
      },
      data: {
        project_id: project.id,
      },
    };

    this.addJob(AI_EVENT_QUEUES.PROJECT_MD_GENERATE.name, input);
  }

  jobProjectDocumentMdGenerate(
    projectDocument: ProjectDocument,
    aiUsageId: string,
  ) {
    const input: ProjectDocumentMdGenerateJobInput = {
      meta: {
        id: uuidV7(),
        ai_usage_id: aiUsageId,
      },
      data: {
        project_id: projectDocument.projectId,
        project_document_id: projectDocument.id,
      },
    };

    this.addJob(AI_EVENT_QUEUES.PROJECT_DOCUMENT_MD_GENERATE.name, input);
  }
}

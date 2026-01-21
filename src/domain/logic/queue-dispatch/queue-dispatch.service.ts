import { AI_USAGE_REF_TABLE } from '@domain/base/ai-usage/ai-usage.constant';
import { newAiUsage } from '@domain/base/ai-usage/ai-usage.factory';
import { AppConfiguration } from '@domain/base/app-configuration/app-configuration.domain';
import { ProjectDocument } from '@domain/base/project-document/project-document.domain';
import { Project } from '@domain/base/project/project.domain';
import { AiEventQueue } from '@domain/queue/ai-event/ai-event.queue';
import { DomainEventQueue } from '@domain/queue/domain-event/domain-event.queue';
import { Injectable } from '@nestjs/common';

@Injectable()
export class QueueDispatchService {
  constructor(
    private aiEventQueue: AiEventQueue,
    private domainEventQueue: DomainEventQueue,
  ) {}

  projectMdGenerate(project: Project, aiConfig: AppConfiguration<'AI'>) {
    const aiUsage = newAiUsage({
      actorId: project.updatedById,
      data: {
        aiUsageAction: 'GENERATE_PROJECT_SUMMARY',
        projectId: project.id,
        refId: project.id,
        refTable: AI_USAGE_REF_TABLE.PROJECT,
        aiModelName: aiConfig.configData.model,
      },
    });

    this.domainEventQueue.jobProcessAiUsage({
      aiUsage,
    });
    this.aiEventQueue.jobProjectMdGenerate(project, aiUsage.id);
  }

  projectDocumentMdGenerate(
    projectDocument: ProjectDocument,
    aiConfig: AppConfiguration<'AI'>,
  ) {
    const aiUsage = newAiUsage({
      actorId: projectDocument.updatedById,
      data: {
        aiUsageAction: 'GENERATE_PROJECT_DOCUMENT_SUMMARY',
        projectId: projectDocument.projectId,
        refId: projectDocument.id,
        refTable: AI_USAGE_REF_TABLE.PROJECT,
        aiModelName: aiConfig.configData.model,
      },
    });

    this.domainEventQueue.jobProcessAiUsage({
      aiUsage,
    });
    this.aiEventQueue.jobProjectDocumentMdGenerate(projectDocument, aiUsage.id);
  }
}

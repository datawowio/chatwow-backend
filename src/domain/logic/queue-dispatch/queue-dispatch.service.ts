import { AI_USAGE_REF_TABLE } from '@domain/base/ai-usage/ai-usage.constant';
import { newAiUsage } from '@domain/base/ai-usage/ai-usage.factory';
import { AiUsageService } from '@domain/base/ai-usage/ai-usage.service';
import { ProjectDocument } from '@domain/base/project-document/project-document.domain';
import { Project } from '@domain/base/project/project.domain';
import { AiEventQueue } from '@domain/queue/ai-event/ai-event.queue';
import { Injectable } from '@nestjs/common';

@Injectable()
export class QueueDispatchService {
  constructor(
    private aiEventQueue: AiEventQueue,
    private aiUsageService: AiUsageService,
  ) {}

  async projectMdGenerate(project: Project) {
    const aiUsage = newAiUsage({
      aiUsageAction: 'GENERATE_PROJECT_SUMMARY',
      projectId: project.id,
      userId: project.updatedById,
      refId: project.id,
      refTable: AI_USAGE_REF_TABLE.PROJECT,
    });
    await this.aiUsageService.save(aiUsage);

    this.aiEventQueue.jobProjectMdGenerate(project, aiUsage.id);
  }

  async projectDocumentMdGenerate(projectDocument: ProjectDocument) {
    const aiUsage = newAiUsage({
      aiUsageAction: 'GENERATE_PROJECT_DOCUMENT_SUMMARY',
      projectId: projectDocument.projectId,
      userId: projectDocument.updatedById,
      refId: projectDocument.id,
      refTable: AI_USAGE_REF_TABLE.PROJECT,
    });
    await this.aiUsageService.save(aiUsage);

    this.aiEventQueue.jobProjectDocumentMdGenerate(projectDocument, aiUsage.id);
  }
}

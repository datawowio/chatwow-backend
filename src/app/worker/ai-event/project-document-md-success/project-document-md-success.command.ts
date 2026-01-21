import { AiUsageToken } from '@domain/base/ai-usage-token/ai-usage-token.domain';
import { newAiUsageToken } from '@domain/base/ai-usage-token/ai-usage-token.factory';
import { AiUsage } from '@domain/base/ai-usage/ai-usage.domain';
import { AiUsageService } from '@domain/base/ai-usage/ai-usage.service';
import { ProjectDocument } from '@domain/base/project-document/project-document.domain';
import { ProjectDocumentService } from '@domain/base/project-document/project-document.service';
import { AiFileService } from '@domain/logic/ai-file/ai-file.service';
import { DomainEventQueue } from '@domain/queue/domain-event/domain-event.queue';
import { Injectable } from '@nestjs/common';

import { CommandInterface } from '@shared/common/common.type';

import { ProjectDocumentMdSuccessData } from './project-document-md-success.type';

type Entity = {
  projectDocument: ProjectDocument;
  aiUsage: AiUsage;
  aiUsageTokens: AiUsageToken[];
};

@Injectable()
export class ProjectDocumentMdSuccessCommand implements CommandInterface {
  constructor(
    //
    private aiFileService: AiFileService,
    private projectDocumentService: ProjectDocumentService,
    private aiUsageService: AiUsageService,
    private domainEventQueue: DomainEventQueue,
  ) {}

  async exec(data: ProjectDocumentMdSuccessData) {
    const entity = await this.find(data);

    const aiSummaryMd = await this.aiFileService.getProjectDocumentSummary(
      entity.projectDocument,
    );
    if (aiSummaryMd === null) {
      throw new Error('projectSummaryFileNotFound');
    }

    entity.projectDocument.edit({
      data: {
        aiSummaryMd,
        documentStatus: 'ACTIVE',
        isRequireRegenerate: false,
      },
    });

    await this.save(entity);
  }

  async find(data: ProjectDocumentMdSuccessData): Promise<Entity> {
    const projectDocument = await this.projectDocumentService.findOne(
      data.projectDocumentId,
    );
    if (!projectDocument) {
      throw new Error('projectDocumentNotFound');
    }

    const aiUsage = await this.aiUsageService.findOne(data.aiUsageId);
    if (!aiUsage) {
      throw new Error('aiUsageNotFound');
    }

    aiUsage.stopRecord({
      confidence: data.confidence,
    });

    const aiUsageTokens = data.tokenUsage.map((tu) =>
      newAiUsageToken({
        aiModelName: tu.modelName,
        inputTokens: tu.inputTokens,
        outputTokens: tu.outputTokens,
        totalTokens: tu.totalTokens,
        cacheCreationInputTokens: tu.cacheCreationInputTokens,
        cacheReadInputTokens: tu.cacheReadInputTokens,
        aiUsageId: aiUsage.id,
      }),
    );

    return {
      projectDocument,
      aiUsage,
      aiUsageTokens,
    };
  }

  async save(entity: Entity) {
    await this.projectDocumentService.save(entity.projectDocument, {
      disableEvent: true,
    });

    this.domainEventQueue.jobProcessAiUsage({
      aiUsage: entity.aiUsage,
      aiUsageTokens: entity.aiUsageTokens,
    });
  }
}

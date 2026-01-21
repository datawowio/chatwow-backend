import { AiUsageToken } from '@domain/base/ai-usage-token/ai-usage-token.domain';
import { newAiUsageToken } from '@domain/base/ai-usage-token/ai-usage-token.factory';
import { AiUsage } from '@domain/base/ai-usage/ai-usage.domain';
import { AiUsageService } from '@domain/base/ai-usage/ai-usage.service';
import { Project } from '@domain/base/project/project.domain';
import { ProjectService } from '@domain/base/project/project.service';
import { AiFileService } from '@domain/logic/ai-file/ai-file.service';
import { DomainEventQueue } from '@domain/queue/domain-event/domain-event.queue';
import { Injectable } from '@nestjs/common';

import { CommandInterface } from '@shared/common/common.type';

import { ProjectMdSuccessData } from './project-md-success.type';

type Entity = {
  project: Project;
  aiUsage: AiUsage;
  aiUsageTokens: AiUsageToken[];
};

@Injectable()
export class ProjectMdSuccessCommand implements CommandInterface {
  constructor(
    //
    private aiFileService: AiFileService,
    private projectService: ProjectService,
    private aiUsageService: AiUsageService,
    private domainEventQueue: DomainEventQueue,
  ) {}

  async exec(data: ProjectMdSuccessData) {
    const entity = await this.find(data);

    const aiSummaryMd = await this.aiFileService.getProjectSummary(
      entity.project,
    );
    if (aiSummaryMd === null) {
      throw new Error('projectSummaryFileNotFound');
    }

    entity.project.edit({
      data: {
        aiSummaryMd,
        projectStatus: 'ACTIVE',
        isRequireRegenerate: false,
      },
    });

    await this.save(entity);
  }

  async find(data: ProjectMdSuccessData): Promise<Entity> {
    const project = await this.projectService.findOne(data.projectId);
    if (!project) {
      throw new Error('projectNotFound');
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
      project,
      aiUsage,
      aiUsageTokens,
    };
  }

  async save(entity: Entity) {
    await this.projectService.save(entity.project, { disableEvent: true });

    this.domainEventQueue.jobProcessAiUsage({
      aiUsage: entity.aiUsage,
      aiUsageTokens: entity.aiUsageTokens,
    });
  }
}

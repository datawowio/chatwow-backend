import { Injectable } from '@nestjs/common';

import { BaseAmqpHandler } from '@infra/global/amqp/amqp.abstract';

import { QueueTask } from '@shared/task/task.decorator';

import { AI_EVENT_QUEUES } from '../worker.constant';
import {
  projectDocumentMdSuccessValidator,
  projectMdSuccessValidator,
} from './ai-event.zod';
import { ProjectDocumentMdSuccessCommand } from './project-document-md-success/project-document-md-success.command';
import { ProjectDocumentMdSuccessRawInput } from './project-document-md-success/project-document-md-success.type';
import { ProjectMdSuccessCommand } from './project-md-success/project-md-success.command';
import { ProjectMdSuccessRawInput } from './project-md-success/project-md-success.type';

@Injectable()
export class AiEventAmqp extends BaseAmqpHandler {
  constructor(
    private projectMdSuccessCommand: ProjectMdSuccessCommand,
    private projectDocumentMdSuccessCommand: ProjectDocumentMdSuccessCommand,
  ) {
    super();
  }

  @QueueTask(
    AI_EVENT_QUEUES.PROJECT_MD_SUCCESS.name,
    projectMdSuccessValidator.parse,
  )
  async processProjectMdSuccess(data: ProjectMdSuccessRawInput) {
    return this.projectMdSuccessCommand.exec({
      projectId: data.project_id,
      // aiUsageId: data.ai_usage_id,
      // confidence: data.confidence,
      // tokenUsage: data.token_usage.map((t) => ({
      //   inputTokens: t.input_tokens,
      //   outputTokens: t.output_tokens,
      //   totalTokens: t.total_tokens,
      //   cacheCreationInputTokens: t.cache_creation_input_tokens,
      //   cacheReadInputTokens: t.cache_read_input_tokens,
      //   modelName: t.model_name as AiModelName,
      // })),
    });
  }

  @QueueTask(
    AI_EVENT_QUEUES.PROJECT_DOCUMENT_MD_SUCCESS.name,
    projectDocumentMdSuccessValidator.parse,
  )
  async processProjectDocumentMdSuccess(
    data: ProjectDocumentMdSuccessRawInput,
  ) {
    return this.projectDocumentMdSuccessCommand.exec({
      projectDocumentId: data.project_document_id,
      // aiUsageId: data.ai_usage_id,
      // confidence: data.confidence,
      // tokenUsage: data.token_usage.map((t) => ({
      //   inputTokens: t.input_tokens,
      //   outputTokens: t.output_tokens,
      //   totalTokens: t.total_tokens,
      //   cacheCreationInputTokens: t.cache_creation_input_tokens,
      //   cacheReadInputTokens: t.cache_read_input_tokens,
      //   modelName: t.model_name as AiModelName,
      // })),
    });
  }
}

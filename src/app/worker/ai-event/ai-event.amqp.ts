import { Injectable } from '@nestjs/common';

import { BaseAmqpHandler } from '@infra/global/amqp/amqp.abstract';

import { QueueTask } from '@shared/task/task.decorator';

import { AI_EVENT_QUEUES } from '../worker.constant';
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

  @QueueTask(AI_EVENT_QUEUES.PROJECT_MD_SUCCESS.name)
  async processProjectMdSuccess(data: ProjectMdSuccessRawInput) {
    return this.projectMdSuccessCommand.exec({
      projectId: data.project_id,
    });
  }

  @QueueTask(AI_EVENT_QUEUES.PROJECT_DOCUMENT_MD_SUCCESS.name)
  async processProjectDocumentMdSuccess(
    data: ProjectDocumentMdSuccessRawInput,
  ) {
    console.log('==================================');
    console.log('asdasdasd');
    console.log('==================================');

    return this.projectDocumentMdSuccessCommand.exec({
      projectDocumentId: data.project_document_id,
    });
  }
}

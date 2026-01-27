import { aiUsageTokenFromJsonState } from '@domain/base/ai-usage-token/ai-usage-token.mapper';
import { aiUsageFromJsonState } from '@domain/base/ai-usage/ai-usage.mapper';
import { passwordResetTokenFromJsonState } from '@domain/base/password-reset-token/password-reset-token.mapper';
import { projectDocumentFromJsonState } from '@domain/base/project-document/project-document.mapper';
import { projectFromJsonState } from '@domain/base/project/project.mapper';
import { userFromJsonState } from '@domain/base/user/user.mapper';
import { Injectable } from '@nestjs/common';

import { BaseAmqpHandler } from '@infra/global/amqp/amqp.abstract';

import { QueueTask } from '@shared/task/task.decorator';

import { DOMAIN_EVENT_QUEUES } from '../worker.constant';
import { OmitJobMeta } from '../worker.type';
import { ForgotPasswordQueueCommand } from './forgot-password/forgot-password.command';
import type { ForgotPasswordJobInput } from './forgot-password/forgot-password.type';
import { ForgotPasswordJobData } from './forgot-password/forgot-password.type';
import { ProcessAiUsageCommand } from './process-ai-usage/process-ai-usage.command';
import {
  ProcessAiUsageJobData,
  ProcessAiUsageJobInput,
} from './process-ai-usage/process-ai-usage.type';
import { SavedProjectDocumentQueueCommand } from './saved-project-document/saved-project-document.command';
import {
  SavedProjectDocumentData,
  SavedProjectDocumentJobInput,
} from './saved-project-document/saved-project-document.type';
import { SavedProjectQueueCommand } from './saved-project/saved-project.command';
import {
  SavedProjectData,
  SavedProjectJobInput,
} from './saved-project/saved-project.type';
import { SendVerificationQueueCommand } from './send-verification/send-verification.command';
import type { SendVerificationJobInput } from './send-verification/send-verification.type';

@Injectable()
export class DomainEventAmqp extends BaseAmqpHandler {
  constructor(
    private sendVerificationQueueCommand: SendVerificationQueueCommand,
    private forgotPasswordQueueCommand: ForgotPasswordQueueCommand,
    private savedProjectDocumentQueueCommand: SavedProjectDocumentQueueCommand,
    private savedProjectQueueCommand: SavedProjectQueueCommand,
    private processAiUsageCommand: ProcessAiUsageCommand,
  ) {
    super();
  }

  @QueueTask(DOMAIN_EVENT_QUEUES.SEND_VERIFICATION.name)
  async processSendVerification(data: OmitJobMeta<SendVerificationJobInput>) {
    return this.sendVerificationQueueCommand.exec(userFromJsonState(data));
  }

  @QueueTask(DOMAIN_EVENT_QUEUES.FORGOT_PASSWORD.name)
  async processForgotPassword(data: OmitJobMeta<ForgotPasswordJobInput>) {
    const dispatchData: ForgotPasswordJobData = {
      user: userFromJsonState(data.user),
      passwordResetToken: passwordResetTokenFromJsonState(
        data.passwordResetToken,
      ),
      action: data.action,
      plainToken: data.plainToken,
    };

    return this.forgotPasswordQueueCommand.exec(dispatchData);
  }

  @QueueTask(DOMAIN_EVENT_QUEUES.SAVED_PROJECT_DOCUMENT.name)
  async savedProjectDocument(input: OmitJobMeta<SavedProjectDocumentJobInput>) {
    const data: SavedProjectDocumentData = projectDocumentFromJsonState(input);

    return this.savedProjectDocumentQueueCommand.exec(data);
  }

  @QueueTask(DOMAIN_EVENT_QUEUES.SAVED_PROJECT.name)
  async savedProject(input: OmitJobMeta<SavedProjectJobInput>) {
    const data: SavedProjectData = projectFromJsonState(input);

    return this.savedProjectQueueCommand.exec(data);
  }

  @QueueTask(DOMAIN_EVENT_QUEUES.PROCESS_AI_USAGE.name)
  async processAiUsage(input: OmitJobMeta<ProcessAiUsageJobInput>) {
    const data: ProcessAiUsageJobData = {
      aiUsage: aiUsageFromJsonState(input.aiUsage),
      aiUsageTokens: input.aiUsageTokens.map((token) =>
        aiUsageTokenFromJsonState(token),
      ),
    };

    return this.processAiUsageCommand.exec(data);
  }
}

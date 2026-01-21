import { aiUsageToJsonState } from '@domain/base/ai-usage/ai-usage.mapper';
import { passwordResetTokenToJsonState } from '@domain/base/password-reset-token/password-reset-token.mapper';
import { projectDocumentToJsonState } from '@domain/base/project-document/project-document.mapper';
import { projectToJsonState } from '@domain/base/project/project.mapper';
import { User } from '@domain/base/user/user.domain';
import { userToJsonState } from '@domain/base/user/user.mapper';
import { Injectable } from '@nestjs/common';

import { BaseAmqpExchange } from '@infra/global/amqp/amqp.abstract';
import { wrapJobMeta } from '@infra/global/amqp/amqp.common';

import {
  ForgotPasswordJobData,
  ForgotPasswordJobInput,
} from '@app/worker/domain-event/forgot-password/forgot-password.type';
import {
  ProcessAiUsageJobData,
  ProcessAiUsageJobInput,
} from '@app/worker/domain-event/process-ai-usage/process-ai-usage.type';
import {
  SavedProjectDocumentData,
  SavedProjectDocumentJobInput,
} from '@app/worker/domain-event/saved-project-document/saved-project-document.type';
import {
  SavedProjectData,
  SavedProjectJobInput,
} from '@app/worker/domain-event/saved-project/saved-project.type';
import { SendVerificationJobInput } from '@app/worker/domain-event/send-verification/send-verification.type';
import { DOMAIN_EVENT_QUEUES, MQ_EXCHANGE } from '@app/worker/worker.constant';

@Injectable()
export class DomainEventQueue extends BaseAmqpExchange {
  config = MQ_EXCHANGE.DOMAIN_EVENT;

  jobSendVerification(user: User) {
    const input: SendVerificationJobInput = wrapJobMeta(userToJsonState(user));

    this.addJob(DOMAIN_EVENT_QUEUES.SEND_VERIFICATION.name, input);
  }

  jobResetPassword(data: ForgotPasswordJobData) {
    const input: ForgotPasswordJobInput = wrapJobMeta({
      user: userToJsonState(data.user),
      passwordResetToken: passwordResetTokenToJsonState(
        data.passwordResetToken,
      ),
      plainToken: data.plainToken,
      action: data.action,
    });

    this.addJob(DOMAIN_EVENT_QUEUES.FORGOT_PASSWORD.name, input);
  }

  jobSavedProjectDocument(data: SavedProjectDocumentData) {
    const input: SavedProjectDocumentJobInput = wrapJobMeta(
      projectDocumentToJsonState(data),
    );

    this.addJob(DOMAIN_EVENT_QUEUES.SAVED_PROJECT_DOCUMENT.name, input);
  }

  jobSavedProject(data: SavedProjectData) {
    const input: SavedProjectJobInput = wrapJobMeta(projectToJsonState(data));

    this.addJob(DOMAIN_EVENT_QUEUES.SAVED_PROJECT.name, input);
  }

  jobProcessAiUsage(data: ProcessAiUsageJobData) {
    const input: ProcessAiUsageJobInput = wrapJobMeta({
      aiUsage: aiUsageToJsonState(data.aiUsage),
    });

    this.addJob(DOMAIN_EVENT_QUEUES.PROCESS_AI_USAGE.name, input);
  }
}

import { passwordResetTokenFromJsonState } from '@domain/base/password-reset-token/password-reset-token.mapper';
import { userFromJsonState } from '@domain/base/user/user.mapper';
import { Injectable } from '@nestjs/common';

import { BaseAmqpHandler } from '@infra/global/amqp/amqp.abstract';

import { QueueTask } from '@shared/task/task.decorator';

import { DOMAIN_EVENT_QUEUES } from '../worker.constant';
import { OmitTaskMeta } from '../worker.type';
import { ForgotPasswordQueueCommand } from './forgot-password/forgot-password.command';
import type { ForgotPasswordJobInput } from './forgot-password/forgot-password.type';
import { ForgotPasswordJobData } from './forgot-password/forgot-password.type';
import { SendVerificationQueueCommand } from './send-verification/send-verification.command';
import type { SendVerificationJobInput } from './send-verification/send-verification.type';

@Injectable()
export class DomainEventAmqp extends BaseAmqpHandler {
  constructor(
    private senVerificationQueueCommand: SendVerificationQueueCommand,
    private forgotPasswordQueueCommand: ForgotPasswordQueueCommand,
  ) {
    super();
  }

  @QueueTask(DOMAIN_EVENT_QUEUES.SEND_VERIFICATION)
  async processSendVerification(data: OmitTaskMeta<SendVerificationJobInput>) {
    return this.senVerificationQueueCommand.exec(userFromJsonState(data));
  }

  @QueueTask(DOMAIN_EVENT_QUEUES.FORGOT_PASSWORD)
  async processForgotPassword(data: OmitTaskMeta<ForgotPasswordJobInput>) {
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
}

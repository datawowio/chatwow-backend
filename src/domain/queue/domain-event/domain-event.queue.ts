import { passwordResetTokenToJsonState } from '@domain/base/password-reset-token/password-reset-token.mapper';
import { User } from '@domain/base/user/user.domain';
import { userToJsonState } from '@domain/base/user/user.mapper';
import { Injectable } from '@nestjs/common';

import { BaseAmqpExchange } from '@infra/global/amqp/amqp.abstract';
import { wrapJobMeta } from '@infra/global/amqp/amqp.common';

import { ForgotPasswordJobData } from '@app/worker/domain-event/forgot-password/forgot-password.type';
import { ForgotPasswordJobInput } from '@app/worker/domain-event/forgot-password/forgot-password.type';
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
    const jobData: ForgotPasswordJobInput = wrapJobMeta({
      user: userToJsonState(data.user),
      passwordResetToken: passwordResetTokenToJsonState(
        data.passwordResetToken,
      ),
      plainToken: data.plainToken,
      action: data.action,
    });

    this.addJob(DOMAIN_EVENT_QUEUES.FORGOT_PASSWORD.name, jobData);
  }
}

import { passwordResetTokenToJsonState } from '@domain/base/password-reset-token/password-reset-token.mapper';
import { User } from '@domain/base/user/user.domain';
import { userToJsonState } from '@domain/base/user/user.mapper';
import { Injectable } from '@nestjs/common';

import { ForgotPasswordJobData } from '@app/worker/domain-event/forgot-password/forgot-password.type';
import { ForgotPasswordJobInput } from '@app/worker/domain-event/forgot-password/forgot-password.type';
import { DOMAIN_EVENT_JOBS } from '@app/worker/worker.job';
import { QUEUE } from '@app/worker/worker.queue';

import { BaseQueue } from '@shared/task/task.abstract';

@Injectable()
export class DomainEventQueue extends BaseQueue {
  queueName = QUEUE.DOMAIN_EVENT;

  jobSendVerification(user: User) {
    this.addJob(DOMAIN_EVENT_JOBS.SEND_VERIFICATION, userToJsonState(user));
  }

  jobResetPassword(data: ForgotPasswordJobData) {
    const jobData: ForgotPasswordJobInput = {
      user: userToJsonState(data.user),
      passwordResetToken: passwordResetTokenToJsonState(
        data.passwordResetToken,
      ),
      plainToken: data.plainToken,
      action: data.action,
    };

    this.addJob(DOMAIN_EVENT_JOBS.FORGOT_PASSWORD, jobData);
  }
}

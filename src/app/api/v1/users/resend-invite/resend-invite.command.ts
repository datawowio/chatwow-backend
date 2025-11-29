import { UserService } from '@domain/base/user/user.service';
import { DomainEventQueue } from '@domain/orchestration/queue/domain-event/domain-event.queue';

import { ApiException } from '@shared/http/http.exception';
import { toHttpSuccess } from '@shared/http/http.mapper';

import { ResendInviteResponse } from './resend-invite.dto';

export class ResendInviteCommand {
  constructor(
    private userService: UserService,
    private domainEventQueue: DomainEventQueue,
  ) {}

  async exec(userId: string): Promise<ResendInviteResponse> {
    const user = await this.find(userId);
    this.domainEventQueue.jobSendVerification(user);

    return toHttpSuccess({
      data: {},
    });
  }

  async find(userId: string) {
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new ApiException(404, 'User not found');
    }

    return user;
  }
}

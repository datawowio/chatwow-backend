import { DomainEventQueue } from '@domain/queue/domain-event/domain-event.queue';
import { Injectable } from '@nestjs/common';

import { SavedProjectData } from './saved-project.type';

@Injectable()
export class SavedProjectQueueCommand {
  constructor(private domainEventQueue: DomainEventQueue) {}

  async exec(_data: SavedProjectData) {
    //
  }
}

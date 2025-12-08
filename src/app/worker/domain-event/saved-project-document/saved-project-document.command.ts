import { DomainEventQueue } from '@domain/queue/domain-event/domain-event.queue';
import { Injectable } from '@nestjs/common';

import { SavedProjectDocumentData } from './saved-project-document.type';

@Injectable()
export class SavedProjectDocumentQueueCommand {
  constructor(private domainEventQueue: DomainEventQueue) {}

  async exec(_data: SavedProjectDocumentData) {
    //
  }
}

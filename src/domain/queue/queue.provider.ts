import { QueueDispatchService } from '@domain/logic/queue-dispatch/queue-dispatch.service';
import { Provider } from '@nestjs/common';

import { AiEventQueue } from './ai-event/ai-event.queue';
import { DomainEventQueue } from './domain-event/domain-event.queue';
import { LineEventQueue } from './line-event/line-event.queue';

export const QUEUE_PROVIDER: Provider[] = [
  //
  DomainEventQueue,
  LineEventQueue,
  AiEventQueue,
  QueueDispatchService,
];

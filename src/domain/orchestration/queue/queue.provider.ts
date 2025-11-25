import { Provider } from '@nestjs/common';

import { DomainEventQueue } from './domain-event/domain-event.queue';
import { LineEventQueue } from './line-event/line-event.queue';

export const QUEUE_PROVIDER: Provider[] = [
  //
  DomainEventQueue,
  LineEventQueue,
];

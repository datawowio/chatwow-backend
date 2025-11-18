import { Module } from '@nestjs/common';

import { LineSessionRepo } from './line-session.repo';
import { LineSessionService } from './line-session.service';

@Module({
  providers: [LineSessionService, LineSessionRepo],
  exports: [LineSessionService],
})
export class LineSessionModule {}

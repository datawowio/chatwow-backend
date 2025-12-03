import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { AiApiService } from './ai-api.service';

@Module({
  imports: [HttpModule],
  providers: [AiApiService],
})
export class AiApiModule {}

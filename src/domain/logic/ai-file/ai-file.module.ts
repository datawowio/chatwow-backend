import { Module } from '@nestjs/common';

import { AiFileService } from './ai-file.service';

@Module({
  providers: [AiFileService],
  exports: [AiFileService],
})
export class AiFileModule {}

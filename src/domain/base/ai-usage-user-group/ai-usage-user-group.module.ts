import { Module } from '@nestjs/common';

import { AiUsageUserGroupService } from './ai-usage-user-group.service';

@Module({
  providers: [AiUsageUserGroupService],
  exports: [AiUsageUserGroupService],
})
export class AiUsageUserGroupModule {}

import { Module } from '@nestjs/common';

import { UserGroupManagerService } from './user-group-manager.service';

@Module({
  providers: [UserGroupManagerService, UserGroupManagerService],
  exports: [UserGroupManagerService],
})
export class UserGroupManagerModule {}

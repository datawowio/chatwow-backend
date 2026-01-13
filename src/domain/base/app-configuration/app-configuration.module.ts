import { Module } from '@nestjs/common';

import { AppConfigurationService } from './app-configuration.service';

@Module({
  providers: [AppConfigurationService],
  exports: [AppConfigurationService],
})
export class AppConfigurationModule {}

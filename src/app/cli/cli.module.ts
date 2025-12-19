import { Module } from '@nestjs/common';

import { InitialsCliSeed } from './initials/initials.cli.seed';

@Module({
  providers: [InitialsCliSeed],
})
export class CliModule {}

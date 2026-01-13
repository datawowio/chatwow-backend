import { Module } from '@nestjs/common';

import { InitialsCliSeed } from './initials/initials.cli.seed';
import { SeedDataCli } from './seed/seed.data.cli';

@Module({
  providers: [InitialsCliSeed, SeedDataCli],
})
export class CliModule {}

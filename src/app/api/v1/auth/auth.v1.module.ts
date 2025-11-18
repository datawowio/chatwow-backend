import { Module } from '@nestjs/common';

import { AuthV1Controller } from './auth.v1.controller';
import { SignInCommand } from './sign-in/sign-in.command';

@Module({
  providers: [SignInCommand],
  controllers: [AuthV1Controller],
})
export class AuthV1Module {}

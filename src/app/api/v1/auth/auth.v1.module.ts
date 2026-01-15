import { Module } from '@nestjs/common';

import { AuthV1Controller } from './auth.v1.controller';
import { CheckProfileQuery } from './check-profile/check-profile.query';
import { CheckResetPasswordQuery } from './check-reset-password/check-reset-password.command';
import { ForgotPasswordCommand } from './forgot-password/forgot-password.command';
import { GetProfileQuery } from './get-profile/get-profile.query';
import { RefreshCommand } from './refresh/refresh.command';
import { ResetPasswordCommand } from './reset-password/reset-password.command';
import { SignInCommand } from './sign-in/sign-in.command';
import { SignOutCommand } from './sign-out/sign-out.command';
import { UpdateProfileCommand } from './update-profile/update-profile.command';

@Module({
  providers: [
    //
    SignInCommand,
    RefreshCommand,
    ForgotPasswordCommand,
    ResetPasswordCommand,
    CheckResetPasswordQuery,
    SignOutCommand,
    GetProfileQuery,
    UpdateProfileCommand,
    CheckProfileQuery,
  ],
  controllers: [AuthV1Controller],
})
export class AuthV1Module {}

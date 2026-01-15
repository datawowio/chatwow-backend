import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import type { FastifyReply, FastifyRequest } from 'fastify';

import { UsePublic, UserClaims } from '@infra/middleware/jwt/jwt.common';

import {
  getRefreshCookie,
  setRefreshCookie,
} from '@shared/common/common.cookie';
import myDayjs from '@shared/common/common.dayjs';
import { ApiException } from '@shared/http/http.exception';

import {
  CheckProfileDto,
  CheckProfileResponse,
} from './check-profile/check-profile.dto';
import { CheckProfileQuery } from './check-profile/check-profile.query';
import { CheckResetPasswordQuery } from './check-reset-password/check-reset-password.command';
import {
  CheckResetPasswordDto,
  CheckResetPasswordResponse,
} from './check-reset-password/check-reset-password.dto';
import { ForgotPasswordCommand } from './forgot-password/forgot-password.command';
import {
  ForgotPasswordDto,
  ForgotPasswordResponse,
} from './forgot-password/forgot-password.dto';
import {
  GetProfileDto,
  GetProfileResponse,
} from './get-profile/get-profile.dto';
import { GetProfileQuery } from './get-profile/get-profile.query';
import { RefreshCommand } from './refresh/refresh.command';
import { RefreshResponse } from './refresh/refresh.dto';
import { ResetPasswordCommand } from './reset-password/reset-password.command';
import {
  ResetPasswordDto,
  ResetPasswordResponse,
} from './reset-password/reset-password.dto';
import { SignInCommand } from './sign-in/sign-in.command';
import { SignInDto, SignInResponse } from './sign-in/sign-in.dto';
import { SignOutCommand } from './sign-out/sign-out.command';
import { SignOutResponse } from './sign-out/sign-out.dto';
import { UpdateProfileCommand } from './update-profile/update-profile.command';
import {
  UpdateProfileDto,
  UpdateProfileResponse,
} from './update-profile/update-profile.dto';

@Controller({ path: 'auth', version: '1' })
export class AuthV1Controller {
  constructor(
    private signInCommand: SignInCommand,
    private refreshCommand: RefreshCommand,
    private forgotPasswordCommand: ForgotPasswordCommand,
    private resetPasswordCommand: ResetPasswordCommand,
    private checkResetPasswordCommand: CheckResetPasswordQuery,
    private signOutCommand: SignOutCommand,
    private checkProfileQuery: CheckProfileQuery,
    private getProfileQuery: GetProfileQuery,
    private updateProfileCommand: UpdateProfileCommand,
  ) {}

  @Post('sign-in')
  @UsePublic()
  @ApiResponse({ type: () => SignInResponse })
  async signIn(
    @Body() body: SignInDto,
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<SignInResponse> {
    const { response, plainToken } = await this.signInCommand.exec(body);
    setRefreshCookie(res, plainToken);

    return response;
  }

  @Post('sign-out')
  @UsePublic()
  @ApiResponse({ type: () => SignOutResponse })
  async signOut(@Req() req: FastifyRequest): Promise<SignOutResponse> {
    const reqToken = getRefreshCookie(req);
    if (!reqToken) {
      throw new ApiException(403, 'invalidSessionToken');
    }

    return this.signOutCommand.exec(reqToken);
  }

  @Get('profile')
  @ApiResponse({ type: () => GetProfileResponse })
  async getSelf(
    @UserClaims() claims: UserClaims,
    @Query() query: GetProfileDto,
  ): Promise<GetProfileResponse> {
    return this.getProfileQuery.exec(claims.userId, query);
  }

  @Patch('profile')
  @ApiResponse({ type: () => UpdateProfileResponse })
  async updateSelf(
    @UserClaims() claims: UserClaims,
    @Body() body: UpdateProfileDto,
  ): Promise<UpdateProfileResponse> {
    return this.updateProfileCommand.exec(claims.userId, body);
  }

  @Post('profile/check')
  @ApiResponse({ type: () => CheckProfileResponse })
  async checkProfile(
    @UserClaims() claims: UserClaims,
    @Body() body: CheckProfileDto,
  ): Promise<CheckProfileResponse> {
    return this.checkProfileQuery.exec(claims.userId, body);
  }

  @Post('refresh')
  @UsePublic()
  @ApiResponse({ type: () => RefreshResponse })
  async refresh(
    @Req() req: FastifyRequest,
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<RefreshResponse> {
    const reqToken = getRefreshCookie(req);
    if (!reqToken) {
      throw new ApiException(403, 'invalidSessionToken');
    }

    const { response, plainToken } = await this.refreshCommand.exec(reqToken);
    setRefreshCookie(res, plainToken);

    return response;
  }

  @Post('forgot-password')
  @UsePublic()
  @ApiResponse({ type: () => ForgotPasswordResponse })
  async forgotPassword(
    @Body() body: ForgotPasswordDto,
  ): Promise<ForgotPasswordResponse> {
    return this.forgotPasswordCommand.exec(body);
  }

  @Post('reset-password')
  @UsePublic()
  @ApiResponse({ type: () => ResetPasswordResponse })
  async resetPassword(
    @Body() body: ResetPasswordDto,
  ): Promise<ResetPasswordResponse> {
    return this.resetPasswordCommand.exec(body);
  }

  @Get('reset-password')
  @UsePublic()
  @Throttle({
    default: {
      limit: 5,
      ttl: myDayjs.duration({ minutes: 5 }).asMilliseconds(),
    },
  })
  @ApiResponse({ type: () => CheckResetPasswordResponse })
  async checkResetPassword(
    @Query() query: CheckResetPasswordDto,
  ): Promise<CheckResetPasswordResponse> {
    return this.checkResetPasswordCommand.exec(query);
  }
}

import { Body, Controller, Post } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import { UsePublic } from '@infra/middleware/jwt/jwt.common';

import { SignInCommand } from './sign-in/sign-in.command';
import { SignInDto, SignInResponse } from './sign-in/sign-in.dto';

@Controller({ path: 'auth', version: '1' })
export class AuthV1Controller {
  constructor(private signInCommand: SignInCommand) {}

  @Post('sign-in')
  @UsePublic()
  @ApiResponse({ type: SignInResponse })
  async signIn(@Body() body: SignInDto): Promise<SignInResponse> {
    return this.signInCommand.exec(body);
  }
}

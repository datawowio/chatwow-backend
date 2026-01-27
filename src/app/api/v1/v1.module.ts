import { Module } from '@nestjs/common';

import { AuthV1Module } from './auth/auth.v1.module';
import { BackofficeV1Module } from './backoffice/backoffice.v1.module';
import { ChatPortalV1Module } from './chat-portal/chat-portal.module';

@Module({
  imports: [BackofficeV1Module, ChatPortalV1Module, AuthV1Module],
})
export class V1Module {}

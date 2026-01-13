import { Module } from '@nestjs/common';

import { BackofficeV1Module } from './backoffice/backoffice.v1.module';
import { ChatPortalV1Module } from './chat-portal/chat-portal.module';

@Module({
  imports: [BackofficeV1Module, ChatPortalV1Module],
})
export class V1Module {}

import { ISignInMode } from '@domain/logic/auth/auth.constant';
import {
  Controller,
  ControllerOptions,
  SetMetadata,
  applyDecorators,
} from '@nestjs/common';

export const PORTAL_KEY = 'PORTAL_KEY';

export function BackOfficeController(options: ControllerOptions) {
  return applyDecorators(
    Controller({
      ...options,
      path: `backoffice/${options.path ?? ''}`,
    }),
    SetMetadata(PORTAL_KEY, 'backoffice' satisfies ISignInMode),
  );
}

export function ChatPortalController(options: ControllerOptions) {
  return applyDecorators(
    Controller({
      ...options,
      path: `chat-portal/${options.path ?? ''}`,
    }),
    SetMetadata(PORTAL_KEY, 'chat-portal' satisfies ISignInMode),
  );
}

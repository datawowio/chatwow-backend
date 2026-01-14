import type { ChatSender } from '@infra/db/db';

import type { UnionArray } from '@shared/common/common.type';

export const CHAT_SENDER: UnionArray<ChatSender> = ['USER', 'BOT'];

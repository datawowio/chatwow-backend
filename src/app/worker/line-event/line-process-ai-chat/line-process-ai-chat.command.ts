import { Injectable } from '@nestjs/common';

import { LineProcessAiChatJobData } from './line-process-ai-chat.type';

@Injectable()
export class LineProcessAiChatCommand {
  async exec(_body: LineProcessAiChatJobData) {
    // verify logic
  }
}

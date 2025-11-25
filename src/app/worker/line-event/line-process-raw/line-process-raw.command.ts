import { Injectable } from '@nestjs/common';

import { LineWebHookMessage } from '@infra/global/line/line.type';

import { LineProcessRawJobData } from './line-process-raw.type';

type MessageType = 'verification' | 'selectionMenu' | 'aiChat';

@Injectable()
export class LineProcessRawCommand {
  async exec(body: LineProcessRawJobData) {
    const _messageType = await this.getMessageType(body.data);
  }

  async getMessageType(data: LineWebHookMessage): Promise<MessageType> {
    const _event = data.events[0];

    return 'verification';
  }

  processVerification() {}
  processSelectionMenu() {}
  processAiChat() {}
}

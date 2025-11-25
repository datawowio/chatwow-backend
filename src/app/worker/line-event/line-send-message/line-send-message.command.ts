import { Injectable } from '@nestjs/common';

import { LineService } from '@infra/global/line/line.service';

import { LineSendMessageJobData } from './line-send-message.type';

@Injectable()
export class LineSendMessageCommand {
  async exec({ config, data }: LineSendMessageJobData) {
    const lineService = new LineService(config);
    await lineService.reply(data.replyToken, data.text);
  }
}

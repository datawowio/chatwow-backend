import { lineBotToPlain } from '@domain/base/line-bot/line-bot.mapper';
import { LineBotService } from '@domain/base/line-bot/line-bot.service';
import { LineEventQueue } from '@domain/queue/line-event/line-event.queue';
import { Injectable, RawBodyRequest } from '@nestjs/common';
import { FastifyRequest } from 'fastify';

import { LineService } from '@infra/global/line/line.service';
import { LineWebHookMessage } from '@infra/global/line/line.type';

import { getLineInfoFromReq } from '@shared/common/common.line';
import { ApiException } from '@shared/http/http.exception';

@Injectable()
export class HandleLineWebhookCommand {
  constructor(
    private lineEventQueue: LineEventQueue,
    private lineBotService: LineBotService,
  ) {}

  async exec(
    req: RawBodyRequest<FastifyRequest>,
    lineBotId: string,
    data: LineWebHookMessage,
  ) {
    const lineBot = await this.lineBotService.findOne(lineBotId);
    if (!lineBot) {
      throw new ApiException(404, 'lineBotNotFound');
    }

    const { channelAccessToken, channelSecret } = lineBotToPlain(lineBot);

    const lineService = new LineService({
      channelAccessToken,
      channelSecret,
    });
    lineService.validateSignature(getLineInfoFromReq(req));

    this.lineEventQueue.jobProcessRaw({
      lineBotId,
      config: {
        channelAccessToken,
        channelSecret,
      },
      data,
    });

    return;
  }
}

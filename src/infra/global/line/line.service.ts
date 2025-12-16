import { Project } from '@domain/base/project/project.domain';
import { messagingApi } from '@line/bot-sdk';
import { createHmac } from 'crypto';

import {
  LINE_NO_PROJECT_REPLY,
  LINE_PROMPT_PROJECT_SELECTION_REPLY,
} from '@app/worker/line-event/line-event.constant';

import { isDefined } from '@shared/common/common.validator';
import { ApiException } from '@shared/http/http.exception';

import { ValidateSignatureOpts } from './line.type';

export class LineService {
  lineApi: messagingApi.MessagingApiClient;
  channelSecret: string;

  constructor(opts: { channelAccessToken: string; channelSecret: string }) {
    this.lineApi = new messagingApi.MessagingApiClient({
      channelAccessToken: opts.channelAccessToken,
    });
    this.channelSecret = opts.channelSecret;
  }

  validateSignature({ signature, rawBody }: ValidateSignatureOpts) {
    if (!signature) {
      throw new ApiException(400, 'invalidSignature');
    }

    if (!rawBody) {
      throw new ApiException(400, 'invalidSignature');
    }

    const computed = createHmac('sha256', this.channelSecret)
      .update(rawBody)
      .digest('base64');

    if (computed !== signature) {
      throw new ApiException(400, 'invalidSignature');
    }
  }

  async showLoading(lineId: string) {
    await this.lineApi.showLoadingAnimation({
      chatId: lineId,
      loadingSeconds: 60,
    });
  }

  async reply(replyToken: string, text: string) {
    await this.lineApi.replyMessage({
      messages: [
        {
          type: 'text',
          text,
        },
      ],
      replyToken,
    });
  }

  async replyProjectSelection(
    replyToken: string,
    projects: Project[],
    addTexts?: string[],
  ) {
    if (!projects.length) {
      await this.reply(replyToken, LINE_NO_PROJECT_REPLY);
      return;
    }

    const messages: messagingApi.Message[] = [];
    if (isDefined(addTexts)) {
      addTexts.forEach((text) => {
        messages.push({
          type: 'text',
          text,
        });
      });
    }

    messages.push({
      type: 'flex',
      altText: LINE_PROMPT_PROJECT_SELECTION_REPLY,
      contents: {
        type: 'bubble',
        body: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'text',
              text: LINE_PROMPT_PROJECT_SELECTION_REPLY,
              weight: 'bold',
              size: 'lg',
            },
            {
              type: 'box',
              layout: 'vertical',
              margin: 'md',
              spacing: 'sm',
              contents: projects.map((p) => ({
                type: 'button',
                action: {
                  type: 'message',

                  // User action here
                  label: p.projectName,

                  // they will reply as this
                  text: p.projectName,
                },
                style: 'primary',
              })),
            },
          ],
        },
      },
    });

    await this.lineApi.replyMessage({
      replyToken,
      messages,
    });
  }
}

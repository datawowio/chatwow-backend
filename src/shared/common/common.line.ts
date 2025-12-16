import type { RawBodyRequest } from '@nestjs/common';
import type { FastifyRequest } from 'fastify';

import { LineWebhookEvent } from '@infra/global/line/line.type';

import { decryptMessage, encryptMessage } from './common.crypto';

export function getLineInfoFromReq(req: RawBodyRequest<FastifyRequest>) {
  const signature = (req.headers['x-line-signature'] as string) || null;
  const rawBody = req.rawBody || null;

  return {
    signature,
    rawBody,
  };
}

export function encryptEventText(events: LineWebhookEvent[]) {
  events.forEach((event) => {
    if (event.message.type === 'text') {
      event.message.text = encryptMessage(event.message.text);
    }
  });
}

export function decryptEventText(events: LineWebhookEvent[]) {
  events.forEach((event) => {
    if (event.message.type === 'text') {
      event.message.text = decryptMessage(event.message.text);
    }
  });
}

import { LineAccount } from '@domain/base/line-account/line-account.domain';
import { lineAccountFromPgWithState } from '@domain/base/line-account/line-account.mapper';
import { LineBot } from '@domain/base/line-bot/line-bot.domain';
import { LineBotService } from '@domain/base/line-bot/line-bot.service';
import { LineSession } from '@domain/base/line-session/line-session.domain';
import { lineSessionFromPgWithState } from '@domain/base/line-session/line-session.mapper';
import { lineSessionsTableFilter } from '@domain/base/line-session/line-session.util';
import { LineEventQueue } from '@domain/queue/line-event/line-event.queue';
import { Injectable } from '@nestjs/common';
import { jsonObjectFrom } from 'kysely/helpers/postgres';

import { MainDb } from '@infra/db/db.main';
import { LineService } from '@infra/global/line/line.service';
import { LineWebhookEvent } from '@infra/global/line/line.type';

import {
  LINE_INVALID_MESSAGE_REPLY,
  LINE_SELECTION_MENU_KEYWORD,
} from '../line-event.constant';
import {
  LineProcessRawJobData,
  ProcessByMessageTypeOpts,
} from './line-process-raw.type';

type Entity = {
  lineBot: LineBot;
  lineData: {
    lineAccount: LineAccount;
    lineSession: LineSession | null;
  } | null;
};

@Injectable()
export class LineProcessRawCommand {
  constructor(
    private db: MainDb,

    private lineEventQueue: LineEventQueue,
    private lineBotService: LineBotService,
  ) {}

  async exec(body: LineProcessRawJobData) {
    const lineService = new LineService(body.config);
    const event = body.data.events[0];
    const lineId = event.source.userId;

    await lineService.showLoading(lineId);

    const isMessageValid = this.checkValidMessage(event);
    if (!isMessageValid) {
      await lineService.reply(event.replyToken, LINE_INVALID_MESSAGE_REPLY);
      return;
    }

    const entity = await this.find(body.lineBotId, lineId);
    if (!entity) {
      // shouldn't happen
      await lineService.reply(event.replyToken, 'ไม่พบเจอบิทในระบบ');
      return;
    }

    this.processByMessageType(entity, { event, config: body.config });
  }

  processByMessageType(entity: Entity, opts: ProcessByMessageTypeOpts) {
    const event = opts.event;
    const message = event.message.text;

    const lineBot = entity.lineBot;
    const lineAccountId = event.source.userId;
    const replyToken = event.replyToken;

    // no line account yet need verification
    if (!entity.lineData) {
      return this.lineEventQueue.jobProcessVerification({
        lineBot,
        lineAccountId,
        replyToken,
        verificationCode: message,
      });
    }

    if (message === LINE_SELECTION_MENU_KEYWORD) {
      return this.lineEventQueue.jobShowSelectionMenu({
        lineBot,
        lineAccountId,
        replyToken,
      });
    }

    if (!entity.lineData.lineSession) {
      return this.lineEventQueue.jobProcessSelectionMenu({
        lineBot,
        lineAccountId,
        replyToken,
        message,
      });
    }

    return this.lineEventQueue.jobProcessAiChat({
      lineBot,
      lineSession: entity.lineData.lineSession,
      replyToken,
      message,
    });
  }

  async find(lineBotId: string, lineId: string): Promise<Entity | null> {
    const lineBot = await this.lineBotService.findOne(lineBotId);
    if (!lineBot) {
      return null;
    }

    const raw = await this.db.read
      //
      .selectFrom('line_accounts')
      .selectAll()
      .select((eb) => [
        jsonObjectFrom(
          eb
            .selectFrom('line_sessions')
            .selectAll()
            .where(lineSessionsTableFilter)
            .where('line_sessions.line_session_status', '!=', 'INACTIVE'),
        ).as('activeSession'),
      ])
      .where('id', '=', lineId)
      .executeTakeFirst();

    if (!raw) {
      return {
        lineBot,
        lineData: null,
      };
    }

    return {
      lineBot,
      lineData: {
        lineAccount: lineAccountFromPgWithState(raw),
        lineSession: raw.activeSession
          ? lineSessionFromPgWithState(raw.activeSession)
          : null,
      },
    };
  }

  checkValidMessage(event: LineWebhookEvent) {
    if (!event) {
      return false;
    }

    // only allow text for now
    if (event.message.type !== 'text') {
      return false;
    }

    if (!event.replyToken) {
      return false;
    }

    return true;
  }
}

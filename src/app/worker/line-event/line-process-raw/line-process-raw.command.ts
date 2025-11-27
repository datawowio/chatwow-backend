import { LineAccount } from '@domain/base/line-account/line-account.domain';
import { LineAccountMapper } from '@domain/base/line-account/line-account.mapper';
import { LineBot } from '@domain/base/line-bot/line-bot.domain';
import { LineBotService } from '@domain/base/line-bot/line-bot.service';
import { LineSession } from '@domain/base/line-session/line-session.domain';
import { LineSessionMapper } from '@domain/base/line-session/line-session.mapper';
import { lineSessionsTableFilter } from '@domain/base/line-session/line-session.util';
import { LineEventQueue } from '@domain/orchestration/queue/line-event/line-event.queue';
import { Inject, Injectable } from '@nestjs/common';
import { jsonObjectFrom } from 'kysely/helpers/postgres';

import { READ_DB, ReadDB } from '@infra/db/db.common';
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
    @Inject(READ_DB)
    private readDb: ReadDB,

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
    const lineSession =
      entity.lineData?.lineSession ||
      LineSession.new({
        lineBotId: entity.lineBot.id,
        lineAccountId: event.source.userId,
      });

    if (!entity.lineData || lineSession.lineSessionStatus === 'INIT') {
      return this.lineEventQueue.jobProcessVerification({
        lineSession,
        lineBot,
        data: {
          replyToken: event.replyToken,
          verificationCode: message,
        },
      });
    }

    if (lineSession.lineSessionStatus === 'PROJECT_SELECTION') {
      return this.lineEventQueue.jobProcessSelectionMenu({
        lineBot,
        lineSession,
        data: {
          message,
          replyToken: event.replyToken,
          lineAccountId: lineSession.lineAccountId,
        },
      });
    }

    if (message === LINE_SELECTION_MENU_KEYWORD || !lineSession.projectId) {
      return this.lineEventQueue.jobShowSelectionMenu({
        lineBot,
        lineSession,
        data: {
          replyToken: event.replyToken,
          lineAccountId: lineSession.lineAccountId,
        },
      });
    }

    return this.lineEventQueue.jobProcessAiChat({
      lineBot,
      lineSession,
      data: {
        message,
        replyToken: event.replyToken,
      },
    });
  }

  async find(lineBotId: string, lineId: string): Promise<Entity | null> {
    const lineBot = await this.lineBotService.findOne(lineBotId);
    if (!lineBot) {
      return null;
    }

    const raw = await this.readDb
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
        lineAccount: LineAccountMapper.fromPgWithState(raw),
        lineSession: raw.activeSession
          ? LineSessionMapper.fromPgWithState(raw.activeSession)
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

import { LineAccount } from '@domain/base/line-account/line-account.domain';
import { newLineAccount } from '@domain/base/line-account/line-account.factory';
import { LineAccountService } from '@domain/base/line-account/line-account.service';
import { newLineChatLog } from '@domain/base/line-chat-log/line-chat-log.factory';
import { UserVerification } from '@domain/base/user-verification/user-verification.domain';
import { userVerificationFromPgWithState } from '@domain/base/user-verification/user-verification.mapper';
import { UserVerificationService } from '@domain/base/user-verification/user-verification.service';
import { usersVerificationsTableFilter } from '@domain/base/user-verification/user-verification.util';
import { User } from '@domain/base/user/user.domain';
import { userFromPgWithState } from '@domain/base/user/user.mapper';
import { UserService } from '@domain/base/user/user.service';
import { usersTableFilter } from '@domain/base/user/user.util';
import { LineEventQueue } from '@domain/queue/line-event/line-event.queue';
import { Injectable } from '@nestjs/common';
import { jsonObjectFrom } from 'kysely/helpers/postgres';

import { MainDb } from '@infra/db/db.main';
import { TransactionService } from '@infra/db/transaction/transaction.service';
import { LineService } from '@infra/global/line/line.service';

import myDayjs from '@shared/common/common.dayjs';

import {
  LINE_INVALID_VERIFICATION_REPLY,
  LINE_SUCCESS_VERIFICATION_REPLY,
} from '../line-event.constant';
import { LineProcessVerificationJobData } from './line-process-verification.type';

type Entity = {
  user: User;
  lineAccount: LineAccount;
  userVerification: UserVerification;
};

@Injectable()
export class LineProcessVerificationCommand {
  constructor(
    private db: MainDb,

    private lineAccountService: LineAccountService,
    private userService: UserService,
    private userVerificationService: UserVerificationService,

    private transactionService: TransactionService,
    private lineEventQueue: LineEventQueue,
  ) {}

  async exec({
    lineBot,
    verificationCode,
    lineChatLogs,
    lineAccountId,
    replyToken,
  }: LineProcessVerificationJobData) {
    const lineService = new LineService(lineBot);

    const res = await this.findUserFromVerification(verificationCode);
    if (!res) {
      const replyMessage = LINE_INVALID_VERIFICATION_REPLY;
      lineChatLogs.push(
        newLineChatLog({
          chatSender: 'BOT',
          lineAccountId,
          message: replyMessage,
        }),
      );

      await lineService.reply(replyToken, replyMessage);
      this.lineEventQueue.jobProcessChatLog(lineChatLogs);
      return;
    }

    const { user, userVerification } = res;
    const lineAccount = newLineAccount({
      id: lineAccountId,
    });
    user.edit({
      data: {
        lineAccountId: lineAccount.id,
      },
    });
    userVerification.edit({
      revokeAt: myDayjs().toDate(),
    });

    await this.save({
      lineAccount,
      user,
      userVerification,
    });

    lineChatLogs.push(
      newLineChatLog({
        chatSender: 'BOT',
        lineAccountId,
        message: LINE_SUCCESS_VERIFICATION_REPLY,
      }),
    );

    this.lineEventQueue.jobShowSelectionMenu({
      lineAccountId,
      lineBot,
      replyToken,
      addMessages: [LINE_SUCCESS_VERIFICATION_REPLY],
      lineChatLogs,
    });
  }

  async save(entity: Entity) {
    await this.transactionService.transaction(async () => {
      await this.lineAccountService.save(entity.lineAccount);
      await this.userService.save(entity.user);
      await this.userVerificationService.save(entity.userVerification);
    });
  }

  async findUserFromVerification(verificationCode: string) {
    const res = await this.db.read
      .selectFrom('user_verifications')
      .where(usersVerificationsTableFilter)
      .where('user_verifications.code', '=', verificationCode.toUpperCase())
      .where('user_verifications.expire_at', '>', myDayjs().toISOString())
      .where('user_verifications.revoke_at', 'is', null)
      .selectAll('user_verifications')
      .select((eb) =>
        jsonObjectFrom(
          eb
            .selectFrom('users')
            .selectAll()
            .where(usersTableFilter)
            .whereRef('users.id', '=', 'user_verifications.user_id'),
        ).as('user'),
      )
      .executeTakeFirst();

    if (!res || !res.user) {
      return null;
    }

    return {
      user: userFromPgWithState(res.user),
      userVerification: userVerificationFromPgWithState(res),
    };
  }
}

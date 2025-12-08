import { LineChatLog } from '@domain/base/line-chat-log/line-chat-log.domain';
import { LineChatLogService } from '@domain/base/line-chat-log/line-chat-log.service';
import { AiFileService } from '@domain/logic/ai-file/ai-file.service';
import { Injectable } from '@nestjs/common';

import { LineProcessChatLogJobData } from './line-process-chat-log.type';

@Injectable()
export class LineProcessChatLogCommand {
  constructor(
    private lineChatLogService: LineChatLogService,
    private aiFileService: AiFileService,
  ) {}

  async exec(body: LineProcessChatLogJobData) {
    await this.save(body);
  }

  async save(chatLogs: LineChatLog[]) {
    await this.lineChatLogService.saveBulk(chatLogs);
    await this.writeToJsonFile(chatLogs);
  }

  async writeToJsonFile(chatLogs: LineChatLog[]) {
    // group by session and process
    const map = new Map<string, LineChatLog[]>();
    for (const chatLog of chatLogs) {
      if (!chatLog.lineSessionId) {
        continue;
      }

      let mappedChatLogs = map.get(chatLog.lineSessionId);
      if (!mappedChatLogs) {
        mappedChatLogs = [];
      }
      mappedChatLogs.push(chatLog);

      map.set(chatLog.lineSessionId, mappedChatLogs);
    }
    for (const [sessionId, lineChatLogs] of map.entries()) {
      await this.aiFileService.appendChatLogs({
        sessionId,
        lineChatLogs,
      });
    }
  }
}

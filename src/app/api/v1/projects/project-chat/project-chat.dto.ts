import { ProjectChatLogResponse } from '@domain/base/project-chat-log/project-chat-log.response';
import { ApiProperty } from '@nestjs/swagger';
import z from 'zod';

import { IDomainData } from '@shared/common/common.type';
import { StandardResponse } from '@shared/http/http.response.dto';
import { zodDto } from '@shared/zod/zod.util';

// ================ Request ================

const zod = z.object({
  text: z.string(),
  previousChatId: z.string().nullable(),
});

export class ProjectChatDto extends zodDto(zod) {}

// ================ Response ================

class ProjectChatBotChatLog implements IDomainData {
  @ApiProperty({ type: () => ProjectChatLogResponse })
  attributes: ProjectChatLogResponse;
}

export class ProjectChatData {
  @ApiProperty({ type: () => ProjectChatBotChatLog })
  botChatLog: ProjectChatBotChatLog;

  @ApiProperty({ type: 'string' })
  replyText: string;
}

export class ProjectChatResponse extends StandardResponse {
  @ApiProperty({ type: () => ProjectChatData })
  data: ProjectChatData;
}

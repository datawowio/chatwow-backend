import { ProjectResponse } from '@domain/base/project/project.response';
import { UserGroupResponse } from '@domain/base/user-group/user-group.response';
import { UserResponse } from '@domain/base/user/user.response';
import { ApiProperty } from '@nestjs/swagger';
import { anyPass } from 'remeda';
import z from 'zod';

import { toSplitCommaArray } from '@shared/common/common.transformer';
import { IDomainData } from '@shared/common/common.type';
import { isISOString, isUndefined } from '@shared/common/common.validator';
import {
  PaginationResponseSchema,
  StandardResponse,
} from '@shared/http/http.response.dto';
import { getSortZod, paginationZod, zodDto } from '@shared/zod/zod.util';

// ========== Request ================

const zod = z.object({
  period: z.enum(['day', 'month', 'year']).optional(),
  group: z
    .object({
      by: z.enum(['project', 'userGroup', 'user']),
      pagination: paginationZod,
      sort: getSortZod([
        'totalTokenUsed',
        'totalPrice',
        'avgReplyTimeMs',
        'totalChatUsages',
        'totalAnswerable',
        'avgConfidence',
      ]).optional(),
    })
    .optional(),
  filter: z
    .object({
      startAt: z
        .string()
        .refine(anyPass([isUndefined, isISOString]))
        .optional(),
      endAt: z
        .string()
        .refine(anyPass([isUndefined, isISOString]))
        .optional(),
      projectIds: z
        .preprocess(toSplitCommaArray, z.array(z.string().uuid()))
        .optional(),
      userIds: z
        .preprocess(toSplitCommaArray, z.array(z.string().uuid()))
        .optional(),
      userGroupIds: z
        .preprocess(toSplitCommaArray, z.array(z.string().uuid()))
        .optional(),
    })
    .optional(),
});

export class ChatSummaryDto extends zodDto(zod) {}

// ========== Response ================

class ChatSummaryAnalyticRelationsUserGroup implements IDomainData {
  @ApiProperty({ type: () => UserGroupResponse })
  attributes: UserGroupResponse;
}

class ChatSummaryAnalyticRelationsProject implements IDomainData {
  @ApiProperty({ type: () => ProjectResponse })
  attributes: ProjectResponse;
}

class ChatSummaryAnalyticRelationsUser implements IDomainData {
  @ApiProperty({ type: () => UserResponse })
  attributes: UserResponse;
}

class ChatSummaryAnalyticRelations {
  userGroup?: ChatSummaryAnalyticRelationsUserGroup;
  project?: ChatSummaryAnalyticRelationsProject;
  user?: ChatSummaryAnalyticRelationsUser;
}

class ChatSummaryAnalyticSummary {
  @ApiProperty({ type: 'string' })
  totalPrice: string;

  @ApiProperty({ type: 'number' })
  totalTokenUsed: number;

  @ApiProperty({ type: 'number' })
  totalChatUsages: number;

  @ApiProperty({ type: 'number' })
  avgReplyTimeMs: number;

  @ApiProperty({ type: 'number' })
  avgConfidence: number;

  @ApiProperty({ type: 'number' })
  totalAnswerable: number;
}

export class ChatSummaryAnalytic {
  @ApiProperty({ type: 'string', format: 'date-time' })
  timestamp?: string;

  @ApiProperty({ type: () => ChatSummaryAnalyticSummary })
  summary: ChatSummaryAnalyticSummary;

  @ApiProperty({ type: () => ChatSummaryAnalyticRelations })
  relations: ChatSummaryAnalyticRelations;
}

class ChatSummaryMetaSummary {
  @ApiProperty({ type: 'string' })
  totalPrice: string;

  @ApiProperty({ type: 'number' })
  totalTokenUsed: number;

  @ApiProperty({ type: 'number' })
  totalChatUsages: number;

  @ApiProperty({ type: 'number' })
  totalAnswerable: number;

  @ApiProperty({ type: 'number' })
  avgReplyTimeMs: number;

  @ApiProperty({ type: 'number' })
  avgConfidence: number;
}

class ChatSummaryMeta {
  @ApiProperty({ type: () => ChatSummaryMetaSummary })
  summary: ChatSummaryMetaSummary;

  @ApiProperty({ type: () => PaginationResponseSchema })
  pagination?: PaginationResponseSchema;
}

class ChatSummaryData {
  @ApiProperty({ type: () => ChatSummaryAnalytic, isArray: true })
  chatSummaries: ChatSummaryAnalytic[];
}

export class ChatSummaryResponse extends StandardResponse {
  @ApiProperty({ type: () => ChatSummaryMeta })
  meta: ChatSummaryMeta;

  @ApiProperty({ type: () => ChatSummaryData })
  data: ChatSummaryData;
}

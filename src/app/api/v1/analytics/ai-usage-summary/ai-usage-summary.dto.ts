import { AI_USAGE_ACTION } from '@domain/base/ai-usage/ai-usage.constant';
import { DepartmentResponse } from '@domain/base/department/department.response';
import { ProjectResponse } from '@domain/base/project/project.response';
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
  period: z.enum(['hour', 'day', 'week', 'month', 'year']).optional(),
  group: z
    .object({
      by: z.enum(['project', 'department', 'user']),
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
      aiUsageActions: z
        .preprocess(toSplitCommaArray, z.array(z.enum(AI_USAGE_ACTION)))
        .optional(),
      projectIds: z
        .preprocess(toSplitCommaArray, z.array(z.string().uuid()))
        .optional(),
      userIds: z
        .preprocess(toSplitCommaArray, z.array(z.string().uuid()))
        .optional(),
      departmentIds: z
        .preprocess(toSplitCommaArray, z.array(z.string().uuid()))
        .optional(),
    })
    .optional(),
});

export class AiUsageSummaryDto extends zodDto(zod) {}

// ========== Response ================

class AiUsageSummaryAnalyticRelationsDepartment implements IDomainData {
  @ApiProperty({ type: () => DepartmentResponse })
  attributes: DepartmentResponse;
}

class AiUsageSummaryAnalyticRelationsProject implements IDomainData {
  @ApiProperty({ type: () => ProjectResponse })
  attributes: ProjectResponse;
}

class AiUsageSummaryAnalyticRelationsUser implements IDomainData {
  @ApiProperty({ type: () => UserResponse })
  attributes: UserResponse;
}

class AiUsageSummaryAnalyticRelations {
  department?: AiUsageSummaryAnalyticRelationsDepartment;
  project?: AiUsageSummaryAnalyticRelationsProject;
  user?: AiUsageSummaryAnalyticRelationsUser;
}

class AiUsageSummaryAnalyticSummary {
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

export class AiUsageSummaryAnalytic {
  @ApiProperty({ type: 'string', format: 'date-time' })
  timestamp?: string;

  @ApiProperty({ type: () => AiUsageSummaryAnalyticSummary })
  summary: AiUsageSummaryAnalyticSummary;

  @ApiProperty({ type: () => AiUsageSummaryAnalyticRelations })
  relations: AiUsageSummaryAnalyticRelations;
}

class AiUsageSummaryPageSummary {
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

  @ApiProperty({ type: 'string' })
  maxPrice: string;

  @ApiProperty({ type: 'number' })
  maxTokenUsed: number;

  @ApiProperty({ type: 'number' })
  maxChatUsages: number;

  @ApiProperty({ type: 'number' })
  maxAnswerable: number;

  @ApiProperty({ type: 'number' })
  maxAvgReplyTimeMs: number;

  @ApiProperty({ type: 'number' })
  maxAvgConfidence: number;

  @ApiProperty({ type: 'string' })
  minPrice: string;

  @ApiProperty({ type: 'number' })
  minTokenUsed: number;

  @ApiProperty({ type: 'number' })
  minChatUsages: number;

  @ApiProperty({ type: 'number' })
  minAnswerable: number;

  @ApiProperty({ type: 'number' })
  minAvgReplyTimeMs: number;

  @ApiProperty({ type: 'number' })
  minAvgConfidence: number;
}

class AiUsageSummaryMeta {
  @ApiProperty({ type: () => AiUsageSummaryPageSummary })
  pageSummary: AiUsageSummaryPageSummary;

  @ApiProperty({ type: () => PaginationResponseSchema })
  pagination?: PaginationResponseSchema;
}

class AiUsageSummaryData {
  @ApiProperty({ type: () => AiUsageSummaryAnalytic, isArray: true })
  chatSummaries: AiUsageSummaryAnalytic[];
}

export class AiUsageSummaryResponse extends StandardResponse {
  @ApiProperty({ type: () => AiUsageSummaryMeta })
  meta: AiUsageSummaryMeta;

  @ApiProperty({ type: () => AiUsageSummaryData })
  data: AiUsageSummaryData;
}

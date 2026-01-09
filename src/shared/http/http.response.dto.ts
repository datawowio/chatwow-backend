import { ApiProperty } from '@nestjs/swagger';

import {
  IPaginationMeta,
  IPaginationSchema,
  IStandardResponse,
} from './http.standard';

export class PaginationResponseSchema implements IPaginationSchema {
  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  nextPage: number;

  @ApiProperty({ example: 0 })
  previousPage: number;

  @ApiProperty({ example: 10 })
  perPage: number;

  @ApiProperty({ example: 100 })
  totalItems: number;

  @ApiProperty({ example: 10 })
  currentPageItems: number;

  @ApiProperty({ example: 10 })
  totalPages: number;
}

export class PaginationMetaResponse implements IPaginationMeta {
  @ApiProperty({ type: () => PaginationResponseSchema })
  pagination: PaginationResponseSchema;
}

export class CursorMetaResponse {
  nextCursor: string | null;
}

export abstract class StandardResponse implements IStandardResponse<any, any> {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: '' })
  key: string;

  abstract data: any;
  meta?: any;
}

import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import {
  GetProjectDto,
  GetProjectResponse,
} from './get-project/get-project.dto';
import { GetProjectQuery } from './get-project/get-project.query';
import {
  ListProjectsDto,
  ListProjectsResponse,
} from './list-projects/list-projects.dto';
import { ListProjectsQuery } from './list-projects/list-projects.query';

@Controller({ path: 'projects', version: '1' })
export class ProjectsV1Controller {
  constructor(
    private listProjectsQuery: ListProjectsQuery,
    private getProjectsQuery: GetProjectQuery,
  ) {}

  @Get()
  @ApiResponse({
    type: () => ListProjectsResponse,
  })
  async listUsers(@Query() query: ListProjectsDto) {
    return this.listProjectsQuery.exec(query);
  }

  @Get(':id')
  @ApiResponse({
    type: () => GetProjectResponse,
  })
  async getUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: GetProjectDto,
  ) {
    return this.getProjectsQuery.exec(id, query);
  }
}

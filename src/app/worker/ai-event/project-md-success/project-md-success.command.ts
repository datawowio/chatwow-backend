import { Project } from '@domain/base/project/project.domain';
import { ProjectService } from '@domain/base/project/project.service';
import { AiFileService } from '@domain/logic/ai-file/ai-file.service';
import { Injectable } from '@nestjs/common';

import { CommandInterface } from '@shared/common/common.type';

import { ProjectMdSuccessData } from './project-md-success.type';

@Injectable()
export class ProjectMdSuccessCommand implements CommandInterface {
  constructor(
    //
    private aiFileService: AiFileService,
    private projectService: ProjectService,
  ) {}

  async exec(data: ProjectMdSuccessData) {
    const project = await this.find(data.projectId);

    const aiSummaryMd = await this.aiFileService.getProjectSummary(project);
    if (aiSummaryMd === null) {
      throw new Error('projectSummaryFileNotFound');
    }

    project.edit({
      data: {
        aiSummaryMd,
        projectStatus: 'ACTIVE',
      },
    });

    await this.save(project);
  }

  async find(projectId: string) {
    const project = await this.projectService.findOne(projectId);
    if (!project) {
      throw new Error('projectNotFound');
    }

    return project;
  }

  async save(project: Project) {
    await this.projectService.save(project, { disableEvent: true });
  }
}

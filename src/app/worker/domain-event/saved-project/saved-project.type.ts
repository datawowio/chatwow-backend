import { Project } from '@domain/base/project/project.domain';
import { ProjectJsonWithState } from '@domain/base/project/project.type';

import { JobInput } from '@app/worker/worker.type';

export type SavedProjectData = Project;
export type SavedProjectJobInput = JobInput<ProjectJsonWithState>;

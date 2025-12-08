import { ProjectDocument } from '@domain/base/project-document/project-document.domain';
import { ProjectDocumentJsonWithState } from '@domain/base/project-document/project-document.type';

import { JobInput } from '@app/worker/worker.type';

export type SavedProjectDocumentData = ProjectDocument;
export type SavedProjectDocumentJobInput =
  JobInput<ProjectDocumentJsonWithState>;

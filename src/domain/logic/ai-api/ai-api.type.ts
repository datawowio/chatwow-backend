import { ProjectDocument } from '@domain/base/project-document/project-document.domain';
import { Project } from '@domain/base/project/project.domain';
import { StoredFile } from '@domain/base/stored-file/stored-file.domain';

type AiContentType = 'text' | 'markdown';
type AiContentRole = 'message' | 'project' | 'project_document';
type AiRequest = {
  content: string;
  contentType?: AiContentType;
  contentRole?: AiContentRole;
  attachments?: [];
};
export type AiApiEntity = {
  project: Project;
  relations: {
    projectDocument: ProjectDocument;
    storedFile: StoredFile;
  }[];
};

export type SendAiApiOpts = {
  request: AiRequest;
  entity: AiApiEntity;
};

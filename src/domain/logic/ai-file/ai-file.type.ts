import { ProjectDocument } from '@domain/base/project-document/project-document.domain';
import { StoredFile } from '@domain/base/stored-file/stored-file.domain';

export type WriteProjectDocumentAiFileOpts = {
  projectDocument: ProjectDocument;
  storedFile: StoredFile;
};

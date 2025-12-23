import { join } from 'path';

const AI_FILE_MAIN_FOLDER = 'ai_files';
const AI_FILE_PROJECT_FOLDER = 'project_folder';
const AI_FILE_CHAT_FOLDER = 'chat_folder';

export function getChatFolderPath(sessionId: string) {
  return join(AI_FILE_MAIN_FOLDER, AI_FILE_CHAT_FOLDER, sessionId);
}

export function getProjectFolderPath(projectId: string) {
  return join(AI_FILE_MAIN_FOLDER, AI_FILE_PROJECT_FOLDER, projectId);
}

export function getProjectDocumentFolderPath(
  projectId: string,
  projectDocumentId: string,
) {
  return join(getProjectFolderPath(projectId), projectDocumentId);
}

export function getProjectSummaryKeyPath(projectId: string) {
  return join(getProjectFolderPath(projectId), 'project_summary.md');
}

export function getProjectUserDescriptionKeyPath(projectId: string) {
  return join(getProjectFolderPath(projectId), 'user_description.txt');
}

export function getProjectMetadataKeyPath(projectId: string) {
  return join(getProjectFolderPath(projectId), 'metadata.json');
}

export function getProjectDocumentSummaryKeyPath(
  projectId: string,
  projectDocumentId: string,
) {
  return join(
    getProjectDocumentFolderPath(projectId, projectDocumentId),
    'data_summary.md',
  );
}

export function getProjectDocumentUserDescriptionKeyPath(
  projectId: string,
  projectDocumentId: string,
) {
  return join(
    getProjectDocumentFolderPath(projectId, projectDocumentId),
    'user_description.txt',
  );
}

export function getProjectDocumentMetadataKeyPath(
  projectId: string,
  projectDocumentId: string,
) {
  return join(
    getProjectDocumentFolderPath(projectId, projectDocumentId),
    'metadata.json',
  );
}

export function getProjectDocumentRawFileKeyPath(
  projectId: string,
  projectDocumentId: string,
  extension: string,
) {
  return join(
    getProjectDocumentFolderPath(projectId, projectDocumentId),
    `raw_file.${extension}`,
  );
}

export function getChatFileKeyPath(sessionId: string, index: number) {
  return join(getChatFolderPath(sessionId), `chat_${index}.json`);
}

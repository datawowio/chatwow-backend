import { ProjectDocument } from '@domain/base/project-document/project-document.domain';
import { StoredFile } from '@domain/base/stored-file/stored-file.domain';

import { ChatSender } from '@infra/db/db';

export type WriteProjectDocumentAiFileOpts = {
  projectDocument: ProjectDocument;
  storedFile: StoredFile;
};

export type AppendChatLogOpts = {
  sessionId: string;
  lineChatLogs: { chatSender: ChatSender; message: string }[];
};

export type ChatJsonContent = {
  logs: { chat_sender: ChatSender; message: string; created_at: string }[];
};

export type MetadataContent = {
  enable: boolean;
};

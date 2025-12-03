export const STORED_FILE_OWNER_TABLE = {
  PROJECT_DOCUMENT: 'project_documents',
} as const;
export type STORED_FILE_OWNER_TABLE =
  (typeof STORED_FILE_OWNER_TABLE)[keyof typeof STORED_FILE_OWNER_TABLE];

export const STORED_FILE_REF_NAME = {
  DEFAULT: 'DEFAULT',
};
export type STORED_FILE_REF_NAME =
  (typeof STORED_FILE_REF_NAME)[keyof typeof STORED_FILE_REF_NAME];

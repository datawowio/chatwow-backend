export const STORED_FILE_STORAGE_KEY_PREFIX = 'stored_files';

export function getStoredFileKey(opts: {
  id: string;
  ownerTable: string;
}): string {
  return `${STORED_FILE_STORAGE_KEY_PREFIX}/${opts.ownerTable}/${opts.id}`;
}

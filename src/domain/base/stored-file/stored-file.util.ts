export function getStoredFilesIdFromKey(key: string) {
  if (!key) {
    throw new Error('no key');
  }

  const id = key.split('/')[key.length - 1];
  return id;
}

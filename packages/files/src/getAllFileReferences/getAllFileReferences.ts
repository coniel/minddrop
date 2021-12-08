import { FileReferenceMap } from '../types';
import { useFileReferencesStore } from '../useFileReferencesStore';

/**
 * Retrieves all file references from the file references store as a `[id]: FileReference` map.
 *
 * @returns A `[id]: FileReference` map.
 */
export function getAllFileReferences(): FileReferenceMap {
  const { files } = useFileReferencesStore.getState();

  return files;
}

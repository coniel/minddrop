import { FileReferenceMap } from '../types';
import { useFileReferencesStore } from '../useFileReferencesStore';

/**
 * Returns a { [id]: FileReference } map of all file references.
 *
 * @returns A `[id]: FileReference` map of all file references.
 */
export function useAllFileReferences(): FileReferenceMap {
  const { files } = useFileReferencesStore();

  return files;
}

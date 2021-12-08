import { FileReferenceMap } from '../types';
import { useFileReferencesStore } from '../useFileReferencesStore';

/**
 * Returns a { [id]: FileReference } map of file references matching the provided IDs.
 *
 * @param fileIds The IDs of the file references to retrieve.
 * @returns A `[id]: FileReference` map of the requested file references.
 */
export function useFileReferences(fileIds: string[]): FileReferenceMap {
  const { files } = useFileReferencesStore();

  return fileIds.reduce(
    (map, fileId) =>
      files[fileId] ? { ...map, [fileId]: files[fileId] } : map,
    {},
  );
}

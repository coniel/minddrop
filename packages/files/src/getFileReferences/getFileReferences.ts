import { FileReferenceMap } from '../types';
import { useFileReferencesStore } from '../useFileReferencesStore';
import { FileReferenceNotFoundError } from '../errors';

/**
 * Retrieves file references by ID from the file references store.
 *
 * @param ids An array of file IDs to retrieve.
 * @returns The requested file references as a `{ [id]: FileReference }` map.
 */
export function getFileReferences(ids: string[]): FileReferenceMap {
  const { files } = useFileReferencesStore.getState();
  const requested = ids.reduce(
    (map, id) => (files[id] ? { ...map, [id]: files[id] } : map),
    {},
  );

  if (Object.keys(requested).length !== ids.length) {
    throw new FileReferenceNotFoundError();
  }

  return requested;
}

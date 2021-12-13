import { FileReference } from '../types';
import { useFileReferencesStore } from '../useFileReferencesStore';
import { FileReferenceNotFoundError } from '../errors';

/**
 * Retrieves a fil referencee by ID from the file references store.
 *
 * @param id The file ID.
 * @returns The requested file reference.
 */
export function getFileReference(id: string): FileReference {
  const file = useFileReferencesStore.getState().files[id];

  if (!file) {
    throw new FileReferenceNotFoundError();
  }

  return file;
}

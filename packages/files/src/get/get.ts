import { getFileReference } from '../getFileReference';
import { getFileReferences } from '../getFileReferences';
import { FileReference, FileReferenceMap } from '../types';

/**
 * Retrieves one or more file references by ID.
 *
 * If provided a single file ID string, returns the its file reference.
 *
 * If provided an array of file IDs, returns a `[id]: FileReference` map of the corresponding files.
 *
 * @param ids An array of file IDs to retrieve.
 * @returns The requested file reference(s).
 */
export function get(fileId: string): FileReference;
export function get(fileIds: string[]): FileReferenceMap;
export function get(
  fileId: string | string[],
): FileReference | FileReferenceMap {
  if (Array.isArray(fileId)) {
    return getFileReferences(fileId);
  }

  return getFileReference(fileId);
}

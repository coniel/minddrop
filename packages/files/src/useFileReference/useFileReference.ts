import { FileReference } from '../types';
import { useFileReferencesStore } from '../useFileReferencesStore';

/**
 * Returns a file reference by ID or `null` if no file reference was found.
 *
 * @param fileId The ID of the file reference to retrieve.
 * @returns The requested file reference or null.
 */
export function useFileReference(fileId: string): FileReference | null {
  const { files } = useFileReferencesStore();
  return files[fileId] || null;
}

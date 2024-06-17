import { FsEntry } from '../../types';
import { mockAddFileEntry } from '../mockAddFileEntry';
import { mockExists } from '../mockExists';
import { mockGetFileEntry } from '../mockGetFileEntry';

/**
 * Creates a copy of a mock file entry.
 *
 * @param root - The file system root file entry.
 * @param path - The path of the file entry to copy.
 * @param copyPath - The path to where to copy the file entry.
 */
export async function mockCopyFile(
  root: FsEntry,
  path: string,
  copyPath: string,
): Promise<void> {
  // Ensure file entry exists
  if (!mockExists(root, path)) {
    throw new Error(
      `Mock FS error: cannot copy file ${path}, path does not exist`,
    );
  }

  const fileEntry = mockGetFileEntry(root, path);

  mockAddFileEntry(
    root,
    JSON.parse(JSON.stringify({ ...fileEntry, path: copyPath })),
  );
}

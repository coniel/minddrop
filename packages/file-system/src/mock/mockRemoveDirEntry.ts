import { FsEntry } from '../types';
import { mockGetFileEntry } from './mockGetFileEntry';
import { mockRemoveFileEntry } from './mockRemoveFileEntry';

/**
 * Removes a directory entry from the mock file system, refusing a
 * directory with contents unless removed recursively, as the real
 * file system does.
 *
 * @param root - The mock file system root.
 * @param path - The path of the directory to remove.
 * @param recursive - Whether to remove the directory's contents with it.
 */
export function mockRemoveDirEntry(
  root: FsEntry,
  path: string,
  recursive = false,
): void {
  const dir = mockGetFileEntry(root, path);

  if (!recursive && dir.children?.length) {
    throw new Error(
      `Mock FS error: cannot remove directory ${path}, it is not empty. Pass { recursive: true } to remove its contents.`,
    );
  }

  mockRemoveFileEntry(root, path);
}

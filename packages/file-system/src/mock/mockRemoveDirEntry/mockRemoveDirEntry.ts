import { FsEntry, MockFileSystemOptions } from '../../types';
import { mockGetFileEntry } from '../mockGetFileEntry';
import { mockRemoveFileEntry } from '../mockRemoveFileEntry';

/**
 * Options for removing a mock directory entry.
 */
export interface MockRemoveDirEntryOptions extends MockFileSystemOptions {
  /**
   * Whether to remove the directory's contents with it.
   */
  recursive?: boolean;
}

/**
 * Removes a directory entry from the mock file system. A directory
 * with contents can only be removed recursively, as on the real file
 * system.
 *
 * @param root - The mock file system root.
 * @param path - The path of the directory to remove.
 * @param options - Removal and matching options.
 *
 * @throws {Error} If the path does not exist.
 * @throws {Error} If the directory has contents and the removal is not recursive.
 */
export function mockRemoveDirEntry(
  root: FsEntry,
  path: string,
  options: MockRemoveDirEntryOptions,
): void {
  // Get the directory to remove
  const dir = mockGetFileEntry(root, path, options);

  // Throw if the directory has contents and the removal is not recursive
  if (!options.recursive && dir.children?.length) {
    throw new Error(
      `Mock FS error: cannot remove directory ${path}, it is not empty. Pass { recursive: true } to remove its contents.`,
    );
  }

  // Remove the directory
  mockRemoveFileEntry(root, path, options);
}

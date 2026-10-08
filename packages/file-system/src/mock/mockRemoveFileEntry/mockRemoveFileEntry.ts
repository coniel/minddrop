import { parentDirPath } from '../../parentDirPath';
import { FsEntry, MockFileSystemOptions } from '../../types';
import { mockGetFileEntry } from '../mockGetFileEntry';
import { resolveMockPathKey } from '../resolveMockPathKey';

/**
 * Removes a file entry from the mock file system.
 *
 * @param root - The mock file system root.
 * @param path - The path of the entry to remove.
 * @param options - The mock file system's matching options.
 *
 * @throws {Error} If the path does not exist.
 */
export function mockRemoveFileEntry(
  root: FsEntry,
  path: string,
  options: MockFileSystemOptions,
): void {
  // Get the parent directory's path
  const parentDir = parentDirPath(path);
  // Get the directory holding the entry
  const parentEntry = parentDir
    ? mockGetFileEntry(root, parentDir, options)
    : root;
  // Get the directory's entries
  const children = parentEntry.children ?? [];

  // Resolve the path's key
  const key = resolveMockPathKey(path, options);
  // Leave out the entry
  const remaining = children.filter(
    (child) => resolveMockPathKey(child.path, options) !== key,
  );

  // Ensure the entry was there to remove
  if (remaining.length === children.length) {
    throw new Error(
      `Mock FS error: cannot remove file entry ${path}, path does not exist`,
    );
  }

  // Remove the entry from its directory
  parentEntry.children = remaining;
}

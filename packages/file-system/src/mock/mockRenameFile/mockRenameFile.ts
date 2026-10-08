import { FsEntry, MockFileSystemOptions } from '../../types';
import { mockAddFileEntry } from '../mockAddFileEntry';
import { mockGetFileEntry } from '../mockGetFileEntry';
import { mockRemoveFileEntry } from '../mockRemoveFileEntry';
import { resolveRelocatedMockFileEntry } from '../resolveRelocatedMockFileEntry';

/**
 * Renames a file entry and updates the paths of its descendants
 * if it has any. A rename to the same path in another case renames
 * the entry to the new case.
 *
 * @param root - The mock file system root.
 * @param oldPath - The path of the file entry to rename.
 * @param newPath - The new file entry path.
 * @param options - The mock file system's matching options.
 *
 * @throws {Error} If the old path does not exist.
 * @throws {Error} If the new path already exists.
 */
export function mockRenameFile(
  root: FsEntry,
  oldPath: string,
  newPath: string,
  options: MockFileSystemOptions,
): void {
  // Get the entry to rename
  const file = mockGetFileEntry(root, oldPath, options);

  // Remove the entry from its old path
  mockRemoveFileEntry(root, oldPath, options);

  // Add the entry back under its new path
  mockAddFileEntry(root, resolveRelocatedMockFileEntry(file, newPath), options);
}
